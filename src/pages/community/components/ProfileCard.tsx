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
  return (
    <section className="profile-card">
      <div className="profile-cover" />
      <i>{initials}</i>
      <div className="profile-body">
        <h2>{displayName}</h2>
        <p>@{username}</p>
      </div>
      <dl>
        <div><dt>{connectionCount}</dt><dd>Connections</dd></div>
        <div><dt>{postCount}</dt><dd>Posts</dd></div>
      </dl>
    </section>
  );
}

