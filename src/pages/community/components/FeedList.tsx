import type { Dispatch, FormEvent, SetStateAction } from "react";
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

type FeedListProps = {
  busyIds: Set<string>;
  commentDrafts: Record<number, string>;
  comments: Record<number, CommunityComment[]>;
  loading: boolean;
  posts: CommunityPost[];
  setCommentDrafts: Dispatch<SetStateAction<Record<number, string>>>;
  onSubmitComment: (postId: number) => Promise<void>;
  onToggleLike: (postId: number) => Promise<void>;
};

export function FeedList({
  busyIds,
  commentDrafts,
  comments,
  loading,
  posts,
  setCommentDrafts,
  onSubmitComment,
  onToggleLike,
}: FeedListProps) {
  return (
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
              onClick={() => void onToggleLike(post.id)}
            >
              <CommunityIcon name="heart" size={15} /> {post.likeCount}
            </button>
            <span><CommunityIcon name="comment" size={15} /> {post.commentCount} Comments</span>
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
        </article>
      ))}
      {!loading && posts.length === 0 && (
        <p className="empty-feed">Your feed is quiet. Connect with people or share the first post.</p>
      )}
    </section>
  );
}

