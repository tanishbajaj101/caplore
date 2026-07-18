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
} from "../types";

const MAX_IMAGES = 6;

export function useCommunity() {
  const user = useMemo(readStoredUser, []);
  const token = user.token ?? "";
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CommunityStatus>({ state: "", message: "" });
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Record<number, CommunityComment[]>>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [postText, setPostText] = useState("");
  const [postFiles, setPostFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const previews = useObjectUrlPreviews(postFiles);

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

  const loadCommunity = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [feedResult, connectionsResult, requestsResult, suggestionsResult] = await Promise.all([
        requestCommunityJson<{ posts: CommunityPost[] }>("/api/community/feed", token),
        requestCommunityJson<{ connections: Connection[] }>("/api/community/connections", token),
        requestCommunityJson<{ requests: ConnectionRequest[] }>("/api/community/connections/requests", token),
        requestCommunityJson<{ suggestions: Suggestion[] }>("/api/community/connections/suggestions", token),
      ]);

      setPosts(feedResult.posts);
      setConnections(connectionsResult.connections);
      setRequests(requestsResult.requests);
      setSuggestions(suggestionsResult.suggestions);
      setStatus({ state: "", message: "" });

      void Promise.all(feedResult.posts.map((post) => loadComments(post.id)));
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not load the community.",
      });
    } finally {
      setLoading(false);
    }
  }, [loadComments, token]);

  useEffect(() => {
    void loadCommunity();
  }, [loadCommunity]);

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
        body: JSON.stringify({ body: text, imageKeys }),
      });

      setPosts((current) => [result.post, ...current]);
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
        if (nextStatus === "accepted") await loadCommunity();
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
    submitComment,
  };
}

