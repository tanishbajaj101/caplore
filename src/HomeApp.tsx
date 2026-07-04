import { useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "caplore_auth";

type AuthUser = {
  username: string;
  name: string;
  email: string;
  phone_number: string;
};

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export default function HomeApp() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/");
  };

  return (
    <div className="home-page">
      <header className="home-nav">
        <a className="home-logo" href="/" aria-label="Caplore home">
          Cap<span>lore</span>
        </a>
        <button className="home-logout" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <main className="home-main">
        <section className="home-welcome">
          <span className="home-eyebrow">Signed in</span>
          <h1>Welcome back, {user?.name ?? "there"}.</h1>
          <p>This is a placeholder home page — replace this with real content.</p>
        </section>

        <section className="home-profile-card" aria-label="Account details">
          <h2>Your Account</h2>
          <dl>
            <div className="home-profile-row">
              <dt>Username</dt>
              <dd>{user?.username ?? "—"}</dd>
            </div>
            <div className="home-profile-row">
              <dt>Name</dt>
              <dd>{user?.name ?? "—"}</dd>
            </div>
            <div className="home-profile-row">
              <dt>Email</dt>
              <dd>{user?.email ?? "—"}</dd>
            </div>
            <div className="home-profile-row">
              <dt>Phone Number</dt>
              <dd>{user?.phone_number ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="home-placeholder-grid">
          <div className="home-placeholder-card">
            <h3>Portfolio</h3>
            <p>Dummy content — coming soon.</p>
          </div>
          <div className="home-placeholder-card">
            <h3>Deal Room Access</h3>
            <p>Dummy content — coming soon.</p>
          </div>
          <div className="home-placeholder-card">
            <h3>Notifications</h3>
            <p>Dummy content — coming soon.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
