import { useEffect, useState } from "react";
import { clearStoredUser } from "../../auth/storage";
import { AppSidebar } from "../../components/navigation/AppSidebar";
import { useSidebarState } from "../../hooks/useSidebarState";
import { initialsFor } from "../../utils/person";
import { CommunityRightRail } from "./components/CommunityRightRail";
import { AppTopbar } from "../../components/navigation/AppTopbar";
import { PasswordDialog } from "../../components/auth/PasswordDialog";
import { useChangePassword } from "../../hooks/useChangePassword";
import { FeedList } from "./components/FeedList";
import { PostComposer } from "./components/PostComposer";
import { ProfileCard } from "./components/ProfileCard";
import { useCommunity } from "./hooks/useCommunity";

export default function CommunityApp() {
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [accountOpen, setAccountOpen] = useState(false);
  const community = useCommunity();
  const displayName = community.user.name || community.user.username || "Investor";
  const initials = initialsFor(community.user.name, community.user.username);
  const {
    passwordOpen,
    passwordSubmitting,
    passwordStatus,
    setPasswordOpen,
    openPasswordForm,
    closePasswordForm,
    changePassword,
  } = useChangePassword(community.user, () => setAccountOpen(false));

  const myPostCount = community.posts.filter((post) => post.authorUsername === community.user.username).length;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (passwordOpen) setPasswordOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [passwordOpen, setSidebarOpen]);

  const logout = () => {
    clearStoredUser();
    window.location.assign("/");
  };

  return (
    <div className={`community-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AppSidebar activeItem="community" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="community-shell app-page-shell">
        <AppTopbar
          accountOpen={accountOpen}
          title={<h1>Community</h1>}
          initials={initials}
          requestCount={community.requests.length}
          sidebarOpen={sidebarOpen}
          user={community.user}
          onLogout={logout}
          onOpenPasswordForm={openPasswordForm}
          onToggleAccount={() => setAccountOpen((open) => !open)}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />

        {passwordOpen && (
          <PasswordDialog
            status={passwordStatus}
            submitting={passwordSubmitting}
            onClose={closePasswordForm}
            onSubmit={changePassword}
          />
        )}

        <main className="community-workspace">
          <aside className="community-left-rail">
            <ProfileCard
              connectionCount={community.connections.length}
              displayName={displayName}
              initials={initials}
              postCount={myPostCount}
              username={community.user.username}
            />
          </aside>

          <section className="community-feed-column">
            {community.status.message && (
              <p className={`community-status ${community.status.state}`}>{community.status.message}</p>
            )}
            {community.loading && <p className="community-status">Loading community...</p>}

            <PostComposer
              initials={initials}
              postFiles={community.postFiles}
              postText={community.postText}
              posting={community.posting}
              previews={community.previews}
              onChangeText={community.setPostText}
              onFilesChange={community.handleFiles}
              onRemoveImage={community.removeImage}
              onSubmit={community.createPost}
            />

            <FeedList
              busyIds={community.busyIds}
              commentDrafts={community.commentDrafts}
              comments={community.comments}
              loading={community.loading}
              posts={community.posts}
              setCommentDrafts={community.setCommentDrafts}
              onSubmitComment={community.submitComment}
              onToggleLike={community.toggleLike}
            />
          </section>

          <CommunityRightRail
            busyIds={community.busyIds}
            requests={community.requests}
            suggestions={community.suggestions}
            onRespondToRequest={community.respondToRequest}
            onSendConnectionRequest={community.sendConnectionRequest}
          />
        </main>
      </div>
    </div>
  );
}

