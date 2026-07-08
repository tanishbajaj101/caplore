import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AppSidebar, AppSidebarToggle } from "./AppSidebar";
import { useSidebarState } from "./useSidebarState";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ??
  "https://caplore-backend-production.up.railway.app"
).replace(/\/$/, "");
const AUTH_STORAGE_KEY = "caplore_auth";
const MAX_IMAGES = 6;

type AuthUser = { username?: string; name?: string; email?: string; token?: string };

type PostImage = { id: number; url: string };

type CommunityPost = {
  id: number;
  authorUsername: string;
  authorName: string;
  body: string;
  createdAt: string;
  images: PostImage[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

type CommunityComment = {
  id: number;
  authorUsername: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type Connection = { username: string; name: string; connectedSince: string };
type ConnectionRequest = { id: number; createdAt: string; fromUser: { username: string; name: string } };
type Suggestion = { username: string; name: string };

type IconName = "search" | "bell" | "chevron" | "image" | "heart" | "comment" | "check" | "x";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    image: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="m21 16-5-5L5 19" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
    comment: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />,
    check: <path d="m5 12 4 4L19 6" />,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function readUser(): AuthUser {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}") as AuthUser;
  } catch {
    return {};
  }
}

function initialsFor(name?: string, username?: string) {
  return (name || username || "Investor")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

async function requestJson<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/login");
    throw new Error("Your session expired. Please log in again.");
  }

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result as T;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="community-card">
      <header className="community-card-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function CommunityApp() {
  const user = useMemo(readUser, []);
  const token = user.token ?? "";
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [accountOpen, setAccountOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ state: "" | "error"; message: string }>({ state: "", message: "" });

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

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = postFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [postFiles]);

  const displayName = user.name || user.username || "Investor";
  const initials = initialsFor(user.name, user.username);
  const myPostCount = posts.filter((post) => post.authorUsername === user.username).length;

  const loadComments = async (postId: number) => {
    try {
      const result = await requestJson<{ comments: CommunityComment[] }>(
        `/api/community/posts/${postId}/comments`,
        token,
      );
      setComments((current) => ({ ...current, [postId]: result.comments }));
    } catch {
      // Comments failing to load for one post shouldn't block the rest of the feed.
    }
  };

  const loadCommunity = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [feedResult, connectionsResult, requestsResult, suggestionsResult] = await Promise.all([
        requestJson<{ posts: CommunityPost[] }>("/api/community/feed", token),
        requestJson<{ connections: Connection[] }>("/api/community/connections", token),
        requestJson<{ requests: ConnectionRequest[] }>("/api/community/connections/requests", token),
        requestJson<{ suggestions: Suggestion[] }>("/api/community/connections/suggestions", token),
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
  };

  const refreshConnections = async () => {
    try {
      const [connectionsResult, requestsResult, suggestionsResult] = await Promise.all([
        requestJson<{ connections: Connection[] }>("/api/community/connections", token),
        requestJson<{ requests: ConnectionRequest[] }>("/api/community/connections/requests", token),
        requestJson<{ suggestions: Suggestion[] }>("/api/community/connections/suggestions", token),
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
  };

  useEffect(() => {
    void loadCommunity();
  }, [token]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/");
  };

  const withBusy = async (key: string, action: () => Promise<void>) => {
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
  };

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
        const presign = await requestJson<{ uploads: { objectKey: string; uploadUrl: string }[] }>(
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

      const result = await requestJson<{ post: CommunityPost }>("/api/community/posts", token, {
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
        await requestJson("/api/community/connections", token, {
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
        await requestJson(`/api/community/connections/${requestId}/respond`, token, {
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
        const result = await requestJson<{ liked: boolean; likeCount: number }>(
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
        const result = await requestJson<{ comment: CommunityComment }>(
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

  return (
    <div className={`community-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AppSidebar activeItem="community" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="community-shell app-page-shell">
        <header className="community-topbar">
          <AppSidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
          <h1 className="community-title">Community</h1>
          <label className="community-search">
            <Icon name="search" size={14} />
            <input type="search" placeholder="Search investors…" disabled />
          </label>
          <button className="notification-button" type="button" aria-label="Connection requests">
            <Icon name="bell" size={15} />
            {requests.length > 0 && <span>{requests.length}</span>}
          </button>
          <div className="account-wrap">
            <button className="account-chip" type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen}>
              <i>{initials}</i>
              <div><strong>{displayName}</strong><small>Caplore member</small></div>
              <Icon name="chevron" size={12} />
            </button>
            {accountOpen && (
              <div className="account-menu">
                {user.email && <span>{user.email}</span>}
                <button type="button" onClick={logout}>Log out</button>
              </div>
            )}
          </div>
        </header>

        <main className="community-workspace">
          <aside className="community-left-rail">
            <section className="profile-card">
              <div className="profile-cover" />
              <i>{initials}</i>
              <div className="profile-body">
                <h2>{displayName}</h2>
                <p>@{user.username}</p>
              </div>
              <dl>
                <div><dt>{connections.length}</dt><dd>Connections</dd></div>
                <div><dt>{myPostCount}</dt><dd>Posts</dd></div>
              </dl>
            </section>
          </aside>

          <section className="community-feed-column">
            {status.message && <p className={`community-status ${status.state}`}>{status.message}</p>}
            {loading && <p className="community-status">Loading community…</p>}

            <form className="composer-card" onSubmit={createPost}>
              <div className="composer-main-row">
                <i>{initials}</i>
                <textarea
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  placeholder="Share a deal insight, market update, or question with your network…"
                  maxLength={4000}
                />
              </div>
              {postFiles.length > 0 && (
                <div className="composer-preview">
                  {postFiles.map((file, index) => (
                    <figure key={`${file.name}-${index}`}>
                      <img src={previews[index]} alt={file.name} />
                      <button type="button" aria-label="Remove image" onClick={() => removeImage(index)}>
                        <Icon name="x" size={12} />
                      </button>
                    </figure>
                  ))}
                </div>
              )}
              <footer>
                <div className="composer-tools">
                  <label>
                    <Icon name="image" size={14} />
                    Image
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleFiles} />
                  </label>
                </div>
                <button className="post-submit" type="submit" disabled={posting || !postText.trim()}>
                  {posting ? "Posting…" : "Post"}
                </button>
              </footer>
            </form>

            <section className="feed-list" aria-label="Community feed">
              {posts.map((post) => (
                <article className="feed-card" key={post.id}>
                  <header className="feed-card-head">
                    <i>{initialsFor(post.authorName, post.authorUsername)}</i>
                    <div>
                      <strong>{post.authorName}</strong>
                      <small>@{post.authorUsername} · {formatTime(post.createdAt)}</small>
                    </div>
                  </header>

                  {post.body && <p className="post-text">{post.body}</p>}
                  {post.images.length > 0 && (
                    <div className={`post-images count-${Math.min(post.images.length, 4)}`}>
                      {post.images.map((image) => <img src={image.url} alt="" key={image.id} />)}
                    </div>
                  )}

                  <div className="post-actions">
                    <button
                      className={post.likedByMe ? "active" : ""}
                      type="button"
                      disabled={busyIds.has(`like:${post.id}`)}
                      onClick={() => void toggleLike(post.id)}
                    >
                      <Icon name="heart" size={15} /> {post.likeCount}
                    </button>
                    <span><Icon name="comment" size={15} /> {post.commentCount} Comments</span>
                  </div>

                  <div className="comment-list">
                    {(comments[post.id] ?? []).map((comment) => (
                      <article key={comment.id}>
                        <i>{initialsFor(comment.authorName, comment.authorUsername)}</i>
                        <div><strong>{comment.authorName}</strong><p>{comment.body}</p></div>
                      </article>
                    ))}
                  </div>
                  <form
                    className="comment-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submitComment(post.id);
                    }}
                  >
                    <input
                      value={commentDrafts[post.id] ?? ""}
                      onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))}
                      placeholder="Write a comment"
                      maxLength={1200}
                    />
                    <button type="submit" disabled={busyIds.has(`comment:${post.id}`) || !(commentDrafts[post.id] ?? "").trim()}>
                      Comment
                    </button>
                  </form>
                </article>
              ))}
              {!loading && posts.length === 0 && (
                <p className="empty-feed">Your feed is quiet. Connect with people or share the first post.</p>
              )}
            </section>
          </section>

          <aside className="community-right-rail">
            <Panel title="People to Connect With">
              <div className="people-list">
                {suggestions.map((person) => (
                  <article key={person.username}>
                    <i>{initialsFor(person.name, person.username)}</i>
                    <div><strong>{person.name}</strong><span>@{person.username}</span></div>
                    <button
                      type="button"
                      disabled={busyIds.has(`connect:${person.username}`)}
                      onClick={() => void sendConnectionRequest(person.username)}
                    >
                      Connect
                    </button>
                  </article>
                ))}
                {suggestions.length === 0 && <p className="community-status">No suggestions right now.</p>}
              </div>
            </Panel>

            {requests.length > 0 && (
              <Panel title="Connection Requests">
                <div className="request-list">
                  {requests.map((request) => (
                    <article key={request.id}>
                      <i>{initialsFor(request.fromUser.name, request.fromUser.username)}</i>
                      <div><strong>{request.fromUser.name}</strong><span>wants to connect</span></div>
                      <div className="request-actions">
                        <button
                          type="button"
                          aria-label="Accept request"
                          disabled={busyIds.has(`respond:${request.id}`)}
                          onClick={() => void respondToRequest(request.id, "accepted")}
                        >
                          <Icon name="check" size={13} />
                        </button>
                        <button
                          className="reject"
                          type="button"
                          aria-label="Reject request"
                          disabled={busyIds.has(`respond:${request.id}`)}
                          onClick={() => void respondToRequest(request.id, "rejected")}
                        >
                          <Icon name="x" size={13} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
