import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { initialsFor } from "../../../utils/person";
import type { CommunityComment, CommunityPost } from "../types";
import { CommunityIcon } from "./CommunityIcon";

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

function SkeletonPost() {
  return (
    <article className="feed-card skeleton-post">
      <header className="feed-card-head">
        <i className="skeleton-avatar" />
        <div>
          <div className="skeleton-text skeleton-title" />
          <div className="skeleton-text skeleton-meta" />
        </div>
      </header>
      <div className="skeleton-text skeleton-body-1" />
      <div className="skeleton-text skeleton-body-2" />
    </article>
  );
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "deal_insight", label: "Deal Insight" },
  { value: "market_update", label: "Market Update" },
  { value: "question", label: "Question" },
];

type FeedListProps = {
  busyIds: Set<string>;
  commentDrafts: Record<number, string>;
  comments: Record<number, CommunityComment[]>;
  loading: boolean;
  posts: CommunityPost[];
  feedType: "feed" | "bookmarks";
  feedCategory: string;
  hasMore: boolean;
  setFeedCategory: (category: string) => void;
  setCommentDrafts: Dispatch<SetStateAction<Record<number, string>>>;
  onSubmitComment: (postId: number) => Promise<void>;
  onToggleLike: (postId: number) => Promise<void>;
  onToggleBookmark: (postId: number) => Promise<void>;
  onLoadComments: (postId: number) => Promise<void>;
  onLoadMore: () => void;
};

export function FeedList({
  busyIds,
  commentDrafts,
  comments,
  loading,
  posts,
  feedType,
  feedCategory,
  hasMore,
  setFeedCategory,
  setCommentDrafts,
  onSubmitComment,
  onToggleLike,
  onToggleBookmark,
  onLoadComments,
  onLoadMore,
}: FeedListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  return (
    <section className="feed-list" aria-label="Community feed">
      {feedType === "feed" && (
        <nav className="feed-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={feedCategory === cat.value ? "active" : ""}
              onClick={() => setFeedCategory(cat.value)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </nav>
      )}

      {posts.map((post) => (
        <article className="feed-card" key={post.id}>
          <header className="feed-card-head">
            <a href={`/profile/${post.authorUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <i>{initialsFor(post.authorName, post.authorUsername)}</i>
            </a>
            <div>
              <a href={`/profile/${post.authorUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <strong>{post.authorName}</strong>
              </a>
              <small>
                <a href={`/profile/${post.authorUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>@{post.authorUsername}</a> · {formatTime(post.createdAt)} {post.category && `· ${post.category}`}
              </small>
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
              onClick={() => void onToggleLike(post.id)}
            >
              <CommunityIcon name="heart" size={15} /> {post.likeCount}
            </button>
            <button
              className={expandedComments.has(post.id) ? "active" : ""}
              type="button"
              onClick={() => {
                const next = new Set(expandedComments);
                if (next.has(post.id)) {
                  next.delete(post.id);
                } else {
                  next.add(post.id);
                  if (!comments[post.id]) void onLoadComments(post.id);
                }
                setExpandedComments(next);
              }}
            >
              <CommunityIcon name="comment" size={15} /> {post.commentCount} Comments
            </button>
            
            <button
              className={`bookmark-btn ${post.bookmarkedByMe ? "active" : ""}`}
              type="button"
              disabled={busyIds.has(`bookmark:${post.id}`)}
              onClick={() => void onToggleBookmark(post.id)}
              style={{ marginLeft: "auto" }}
            >
              <CommunityIcon name="bookmark" size={15} />
            </button>
          </div>

          {expandedComments.has(post.id) && (
            <>
              <div className="comment-list">
                {(comments[post.id] ?? []).map((comment) => (
                  <article key={comment.id}>
                    <a href={`/profile/${comment.authorUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <i>{initialsFor(comment.authorName, comment.authorUsername)}</i>
                    </a>
                    <div>
                      <a href={`/profile/${comment.authorUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <strong>{comment.authorName}</strong>
                      </a>
                      <p>{comment.body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <form
                className="comment-form"
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  void onSubmitComment(post.id);
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
            </>
          )}
        </article>
      ))}

      {loading && (
        <>
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </>
      )}

      {!loading && posts.length === 0 && (
        <p className="empty-feed">
          {feedType === "bookmarks" 
            ? "You haven't bookmarked any posts yet." 
            : "Your feed is quiet. Connect with people or share the first post."}
        </p>
      )}

      {!loading && hasMore && (
        <button className="load-more-btn" onClick={onLoadMore} type="button">
          Load more
        </button>
      )}
    </section>
  );
}
