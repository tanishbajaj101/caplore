export function PublicProfileTopbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="pub-profile-topbar">
      <a className="pub-profile-brand" href="/">
        <span className="pub-profile-brand-mark">C</span>
        <strong>Caplore</strong>
      </a>
      <nav className="pub-profile-topnav">
        {isLoggedIn ? (
          <a href="/community" className="pub-profile-nav-link">Community</a>
        ) : (
          <>
            <a href="/login" className="pub-profile-nav-link">Log in</a>
            <a href="/join" className="pub-profile-nav-cta">Join Caplore</a>
          </>
        )}
      </nav>
    </header>
  );
}
