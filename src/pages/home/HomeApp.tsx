import { useEffect, useState } from "react";
import { clearStoredUser, readStoredUser, type AuthUser } from "../../auth/storage";
import { AiDailyBriefPanel } from "../dashboard/components/AiDailyBriefPanel";
import "../dashboard/dashboard-home.css";

export default function HomeApp() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    window.location.assign("/");
  };

  return (
    <div className="home-page dashboard-app" style={{ minHeight: "100vh", background: "#f5f7fb" }}>
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
          <p>Here is your daily AI-powered news briefing.</p>
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

        <section className="home-news-section" style={{ gridColumn: "1 / -1" }}>
          <AiDailyBriefPanel />
        </section>
      </main>
    </div>
  );
}
