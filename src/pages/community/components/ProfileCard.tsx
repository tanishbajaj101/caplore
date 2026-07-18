import { useState } from "react";

export function ProfileCard({
  connectionCount,
  displayName,
  initials,
  postCount,
  username,
}: {
  connectionCount: number;
  displayName: string;
  initials: string;
  postCount: number;
  username?: string;
}) {
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);

  const copyProfileLink = () => {
    const url = `${window.location.origin}/profile/${username ?? ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setProfileLinkCopied(true);
      setTimeout(() => setProfileLinkCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy profile link:", err);
    });
  };

  return (
    <section className="profile-card">
      <div className="profile-cover" />
      <i>{initials}</i>
      <div className="profile-body">
        <h2>{displayName}</h2>
        <p>@{username}</p>
        <button 
          onClick={copyProfileLink}
          className={`share-profile-btn ${profileLinkCopied ? "copied" : ""}`}
        >
          {profileLinkCopied ? "✓ Link copied!" : "Share Profile"}
        </button>
      </div>
      <dl>
        <div><dt>{connectionCount}</dt><dd>Connections</dd></div>
        <div><dt>{postCount}</dt><dd>Posts</dd></div>
      </dl>
    </section>
  );
}

export function SkeletonProfile() {
  return (
    <section className="profile-card skeleton-profile">
      <div className="profile-cover" />
      <div className="skeleton-avatar" style={{ margin: "-20px auto 10px" }} />
      <div className="profile-body" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="skeleton-text skeleton-title" style={{ width: "60%" }} />
        <div className="skeleton-text skeleton-meta" style={{ width: "40%", marginBottom: "16px" }} />
      </div>
      <dl style={{ borderTop: "1px solid var(--border)", display: "flex", padding: "10px 0" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="skeleton-text" style={{ width: "30px", height: "16px", marginBottom: "4px" }} />
          <div className="skeleton-text" style={{ width: "50px", height: "10px" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", borderLeft: "1px solid var(--border)" }}>
          <div className="skeleton-text" style={{ width: "30px", height: "16px", marginBottom: "4px" }} />
          <div className="skeleton-text" style={{ width: "30px", height: "10px" }} />
        </div>
      </dl>
    </section>
  );
}

