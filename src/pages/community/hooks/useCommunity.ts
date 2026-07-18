import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { readStoredUser } from "../../../auth/storage";
import { useObjectUrlPreviews } from "../../../hooks/useObjectUrlPreviews";
import { requestCommunityJson } from "../api";
import type {
  CommunityComment,
  CommunityPost,
  CommunityStatus,
  Connection,
  ConnectionRequest,
  Suggestion,
  UserProfile,
} from "../types";

const MAX_IMAGES = 6;

export function useCommunity() {
  const user = useMemo(readStoredUser, []);
  const token = user.token ?? "";
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CommunityStatus>({ state: "", message: "" });
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Feed state
  const [feedType, setFeedType] = useState<"feed" | "bookmarks">("feed");
  const [feedCategory, setFeedCategory] = useState<string>("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  
  // Post composing state
  const [postCategory, setPostCategory] = useState("deal_insight");
  const [postText, setPostText] = useState("");
  const [postFiles, setPostFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const previews = useObjectUrlPreviews(postFiles);
  
  // Social/Interaction state
  const [comments, setComments] = useState<Record<number, CommunityComment[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  
  // Connections state
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const loadComments = useCallback(async (postId: number) => {
    try {
      const result = await requestCommunityJson<{ comments: CommunityComment[] }>(
        `/api/community/posts/${postId}/comments`,
        token,
      );
      setComments((current) => ({ ...current, [postId]: result.comments }));
    } catch {
      // One failed comment thread should not block the rest of the community feed.
    }
  }, [token]);

  const refreshConnections = useCallback(async () => {
    try {
      const [connectionsResult, requestsResult, suggestionsResult] = await Promise.all([
        requestCommunityJson<{ connections: Connection[] }>("/api/community/connections", token),
        requestCommunityJson<{ requests: ConnectionRequest[] }>("/api/community/connections/requests", token),
        requestCommunityJson<{ suggestions: Suggestion[] }>("/api/community/connections/suggestions", token),
      ]);
      setConnections(connectionsResult.connections);
      setRequests(requestsResult.requests);
      setSuggestions(suggestionsResult.suggestions);
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not refresh connections.",
      });
    }
  }, [token]);

  const loadFeed = useCallback(async (isLoadMore: boolean = false) => {
    if (!token) return;

    if (!isLoadMore) {
      setLoading(true);
      setPosts([]);
    }

    try {
      const currentCursor = isLoadMore ? cursor : null;
      let endpoint = feedType === "bookmarks" ? "/api/community/bookmarks" : "/api/community/feed";
      
      const queryParams = new URLSearchParams();
      if (currentCursor) queryParams.append("before", currentCursor);
      if (feedType === "feed" && feedCategory !== "all") queryParams.append("category", feedCategory);
      
      const queryString = queryParams.toString();
      if (queryString) endpoint += `?${queryString}`;

      const [feedResult, connectionsResult, requestsResult, suggestionsResult] = await Promise.all([
        requestCommunityJson<{ posts: CommunityPost[]; nextCursor?: string }>(endpoint, token),
        !isLoadMore ? requestCommunityJson<{ connections: Connection[] }>("/api/community/connections", token) : Promise.resolve(null),
        !isLoadMore ? requestCommunityJson<{ requests: ConnectionRequest[] }>("/api/community/connections/requests", token) : Promise.resolve(null),
        !isLoadMore ? requestCommunityJson<{ suggestions: Suggestion[] }>("/api/community/connections/suggestions", token) : Promise.resolve(null),
      ]);

      setPosts((current) => isLoadMore ? [...current, ...feedResult.posts] : feedResult.posts);
      setCursor(feedResult.nextCursor || null);
      setHasMore(!!feedResult.nextCursor);

      if (connectionsResult) setConnections(connectionsResult.connections);
      if (requestsResult) setRequests(requestsResult.requests);
      if (suggestionsResult) setSuggestions(suggestionsResult.suggestions);
      
      setStatus({ state: "", message: "" });

      void Promise.all(feedResult.posts.map((post) => loadComments(post.id)));
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not load the community.",
      });
    } finally {
      if (!isLoadMore) setLoading(false);
    }
  }, [loadComments, token, feedType, feedCategory, cursor]);

  useEffect(() => {
    void loadFeed(false);
  }, [feedType, feedCategory, token]);

  const loadUserProfile = useCallback(async () => {
    if (!user.username || !token) return;
    setProfileLoading(true);
    try {
      const result = await requestCommunityJson<{ profile: UserProfile }>(
        `/api/profile/${user.username}`,
        token
      );
      setProfile(result.profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setProfileLoading(false);
    }
  }, [user.username, token]);

  useEffect(() => {
    void loadUserProfile();
  }, [loadUserProfile]);

  const withBusy = useCallback(async (key: string, action: () => Promise<void>) => {
    setBusyIds((current) => new Set(current).add(key));
    try {
      await action();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_IMAGES);
    setPostFiles(files);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setPostFiles((current) => current.filter((_, i) => i !== index));
  };

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = postText.trim();
    if (!text || posting) return;

    setPosting(true);
    try {
      let imageKeys: string[] = [];

      if (postFiles.length > 0) {
        const presign = await requestCommunityJson<{ uploads: { objectKey: string; uploadUrl: string }[] }>(
          "/api/community/uploads/presign",
          token,
          {
            method: "POST",
            body: JSON.stringify({
              files: postFiles.map((file) => ({ fileName: file.name, contentType: file.type })),
            }),
          },
        );

        await Promise.all(
          presign.uploads.map((upload, index) =>
            fetch(upload.uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": postFiles[index].type },
              body: postFiles[index],
            }).then((response) => {
              if (!response.ok) throw new Error("Could not upload one of the images.");
            }),
          ),
        );

        imageKeys = presign.uploads.map((upload) => upload.objectKey);
      }

      const result = await requestCommunityJson<{ post: CommunityPost }>("/api/community/posts", token, {
        method: "POST",
        body: JSON.stringify({ body: text, imageKeys, category: postCategory }),
      });

      if (feedType === "feed" && (feedCategory === "all" || feedCategory === postCategory)) {
        setPosts((current) => [result.post, ...current]);
      }
      setComments((current) => ({ ...current, [result.post.id]: [] }));
      setPostText("");
      setPostFiles([]);
      setStatus({ state: "", message: "" });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not create the post.",
      });
    } finally {
      setPosting(false);
    }
  };

  const sendConnectionRequest = (receiverUsername: string) =>
    withBusy(`connect:${receiverUsername}`, async () => {
      try {
        await requestCommunityJson("/api/community/connections", token, {
          method: "POST",
          body: JSON.stringify({ receiverUsername }),
        });
        await refreshConnections();
      } catch (error) {
        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Could not send the connection request.",
        });
      }
    });

  const respondToRequest = (requestId: number, nextStatus: "accepted" | "rejected") =>
    withBusy(`respond:${requestId}`, async () => {
      try {
        await requestCommunityJson(`/api/community/connections/${requestId}/respond`, token, {
          method: "POST",
          body: JSON.stringify({ status: nextStatus }),
        });
        await refreshConnections();
        if (nextStatus === "accepted") void loadFeed(false);
      } catch (error) {
        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Could not update the connection request.",
        });
      }
    });

  const toggleLike = (postId: number) =>
    withBusy(`like:${postId}`, async () => {
      try {
        const result = await requestCommunityJson<{ liked: boolean; likeCount: number }>(
          `/api/community/posts/${postId}/like`,
          token,
          { method: "POST" },
        );
        setPosts((current) =>
          current.map((post) =>
            post.id === postId ? { ...post, likedByMe: result.liked, likeCount: result.likeCount } : post,
          ),
        );
      } catch (error) {
        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Could not update like.",
        });
      }
    });

  const toggleBookmark = (postId: number) =>
    withBusy(`bookmark:${postId}`, async () => {
      try {
        const result = await requestCommunityJson<{ bookmarked: boolean }>(
          `/api/community/posts/${postId}/bookmark`,
          token,
          { method: "POST" },
        );
        
        if (feedType === "bookmarks" && !result.bookmarked) {
          setPosts((current) => current.filter(post => post.id !== postId));
        } else {
          setPosts((current) =>
            current.map((post) =>
              post.id === postId ? { ...post, bookmarkedByMe: result.bookmarked } : post,
            ),
          );
        }
      } catch (error) {
        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Could not update bookmark.",
        });
      }
    });

  const submitComment = (postId: number) =>
    withBusy(`comment:${postId}`, async () => {
      const text = (commentDrafts[postId] ?? "").trim();
      if (!text) return;

      try {
        const result = await requestCommunityJson<{ comment: CommunityComment }>(
          `/api/community/posts/${postId}/comments`,
          token,
          { method: "POST", body: JSON.stringify({ body: text }) },
        );
        setComments((current) => ({
          ...current,
          [postId]: [...(current[postId] ?? []), result.comment],
        }));
        setPosts((current) =>
          current.map((post) => (post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post)),
        );
        setCommentDrafts((drafts) => ({ ...drafts, [postId]: "" }));
      } catch (error) {
        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Could not add the comment.",
        });
      }
    });

  return {
    user,
    loading,
    status,
    posts,
    hasMore,
    feedType,
    setFeedType,
    feedCategory,
    setFeedCategory,
    postCategory,
    setPostCategory,
    loadMore: () => void loadFeed(true),
    comments,
    connections,
    requests,
    suggestions,
    postText,
    setPostText,
    postFiles,
    previews,
    posting,
    commentDrafts,
    setCommentDrafts,
    busyIds,
    handleFiles,
    removeImage,
    createPost,
    sendConnectionRequest,
    respondToRequest,
    toggleLike,
    toggleBookmark,
    submitComment,
    profile,
    profileLoading,
  };
}
