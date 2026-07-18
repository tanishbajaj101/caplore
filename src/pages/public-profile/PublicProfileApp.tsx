import { usePublicProfile } from "./hooks/usePublicProfile";
import { PublicProfileTopbar } from "./components/PublicProfileTopbar";
import { PublicProfileSkeleton } from "./components/PublicProfileSkeleton";
import { PublicProfileCard } from "./components/PublicProfileCard";

export default function PublicProfileApp({ username }: { username: string }) {
  const {
    profile,
    loadError,
    isConnected,
    connectBusy,
    connectError,
    copied,
    isOwnProfile,
    isLoggedIn,
    sendConnect,
    copyShareLink,
  } = usePublicProfile(username);

  return (
    <div className="pub-profile-page">
      <PublicProfileTopbar isLoggedIn={isLoggedIn} />

      <main className="pub-profile-main">
        {loadError ? (
          <div className="pub-profile-error">
            <p>{loadError}</p>
            <a href="/">Back to home</a>
          </div>
        ) : !profile ? (
          <PublicProfileSkeleton />
        ) : (
          <PublicProfileCard
            profile={profile}
            isOwnProfile={isOwnProfile}
            isLoggedIn={isLoggedIn}
            isConnected={isConnected}
            connectBusy={connectBusy}
            connectError={connectError}
            copied={copied}
            onConnect={sendConnect}
            onCopyShareLink={copyShareLink}
          />
        )}
      </main>
    </div>
  );
}
