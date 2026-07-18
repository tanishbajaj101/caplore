import type { PublicProfile } from "../types";

function initialsFor(name?: string, username?: string) {
  return (name || username || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatMemberSince(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

type PublicProfileCardProps = {
  profile: PublicProfile;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  isConnected: boolean;
  connectBusy: boolean;
  connectError: string | null;
  copied: boolean;
  onConnect: () => void;
  onCopyShareLink: () => void;
};

export function PublicProfileCard({
  profile,
  isOwnProfile,
  isLoggedIn,
  isConnected,
  connectBusy,
  connectError,
  copied,
  onConnect,
  onCopyShareLink,
}: PublicProfileCardProps) {
  const initials = initialsFor(profile.name, profile.username);

  return (
    <div className="pub-profile-card">
      <div className="pub-profile-cover" />
      <i className="pub-profile-avatar">{initials}</i>

      <div className="pub-profile-body">
        <h1>{profile.name}</h1>
        <p className="pub-profile-username">@{profile.username}</p>
        <p className="pub-profile-since">Member since {formatMemberSince(profile.memberSince)}</p>

        <div className="pub-profile-actions">
          {isOwnProfile && (
            <button
              id="share-profile-btn"
              type="button"
              className={`pub-btn pub-btn-secondary ${copied ? "copied" : ""}`}
              onClick={() => void onCopyShareLink()}
            >
              {copied ? "Link copied" : "Share Profile"}
            </button>
          )}
          {isLoggedIn && !isOwnProfile && !isConnected && (
            <button
              id="connect-btn"
              type="button"
              className="pub-btn pub-btn-primary"
              onClick={() => void onConnect()}
              disabled={connectBusy}
            >
              {connectBusy ? "Sending..." : "Connect"}
            </button>
          )}
        </div>

        {connectError && <p className="pub-profile-error-inline">{connectError}</p>}
      </div>

      <dl className="pub-profile-stats">
        <div className="pub-stat-cell">
          <dt>{profile.postCount}</dt>
          <dd>Posts</dd>
        </div>
        <div className="pub-stat-cell">
          <dt>{profile.connectionCount}</dt>
          <dd>Connections</dd>
        </div>
        <div className="pub-stat-cell">
          <dt>{formatMemberSince(profile.memberSince)}</dt>
          <dd>Joined</dd>
        </div>
      </dl>
    </div>
  );
}
