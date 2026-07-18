import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiBaseUrl } from "../../api/config";
import { clearStoredUser, readStoredUser, type AuthUser } from "../../auth/storage";
import { AppSidebar } from "../../components/navigation/AppSidebar";
import { useCompanyIndex } from "../../hooks/useCompanyIndex";
import { useSidebarState } from "../../hooks/useSidebarState";
import { initialsFor } from "../../utils/person";
import { AiDailyBriefPanel } from "./components/AiDailyBriefPanel";
import { AppIcon } from "../../components/navigation/AppIcon";
import { DashboardPanel } from "./components/DashboardPanel";
import { AppTopbar } from "../../components/navigation/AppTopbar";
import { PasswordDialog } from "../../components/auth/PasswordDialog";
import { useChangePassword } from "../../hooks/useChangePassword";
import { OpportunitiesPanel } from "./components/OpportunitiesPanel";
import { StatsRow, type DashboardStat } from "./components/StatsRow";

const stats: DashboardStat[] = [
  { label: "Invested", value: "₹6.48 Cr", note: "↑ 12.35%", icon: "shield", tone: "blue", up: true },
  { label: "Valuation", value: "₹8.72 Cr", note: "↑ 18.74%", icon: "trend", tone: "green", up: true },
  { label: "XIRR", value: "18.74%", note: "↑ 1.35x Multiple", icon: "chart", tone: "green", up: true },
  { label: "Live Deals", value: "42", note: "Pre-IPO & Growth", icon: "search", tone: "blue" },
  { label: "New This Week", value: "8", note: "Deals Added", icon: "calendar", tone: "amber" },
  { label: "IPO Pipeline", value: "27", note: "SME IPOs Tracked", icon: "bolt", tone: "blue" },
];

const signals = [
  ["Governance", "Independent Director resigned in XYZ Ltd.", "1h ago", "red"],
  ["Financial", "Receivables increased 40% in LMN Ltd.", "3h ago", "amber"],
  ["Valuation", "Peer valuation expanded 25% in sector", "5h ago", "green"],
  ["Fundraising", "PQR Components preparing pre-IPO round", "6h ago", "blue"],
  ["IPO Signal", "ABC Engineering appointed merchant banker", "8h ago", "purple"],
];

export default function DashboardHomeApp() {
  const user = useMemo(readStoredUser, []) as AuthUser;
  const [accountOpen, setAccountOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const { companies: deals, error: dealsError } = useCompanyIndex();
  const {
    passwordOpen,
    passwordSubmitting,
    passwordStatus,
    setPasswordOpen,
    openPasswordForm,
    closePasswordForm,
    changePassword,
  } = useChangePassword(user, () => setAccountOpen(false));

  const firstName = user.name?.trim().split(/\s+/)[0] || user.username || "Investor";
  const initials = initialsFor(user.name, user.username);
  const featuredDeals = deals.slice(0, 6);
  const logout = () => { clearStoredUser(); window.location.assign("/"); };

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

  return <div className={`dashboard-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
    <AppSidebar activeItem="dashboard" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <main className="dashboard-shell app-page-shell">
      <AppTopbar
        accountOpen={accountOpen}
        title={
          <>
            <h1>Good Morning, {firstName} 👋</h1>
            <p>Here's what is happening in the market today.</p>
          </>
        }
        initials={initials}
        sidebarOpen={sidebarOpen}
        user={user}
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

      <div className="dashboard-content">
        <StatsRow stats={stats} />

        <div className="dashboard-grid">
          <div className="dashboard-main-column">
            <OpportunitiesPanel dealsError={dealsError} featuredDeals={featuredDeals} />

            <DashboardPanel title={<span className="title-with-badge">CAPLORE Signals <b>AI Powered</b></span>} action={<a href="#">View All →</a>}>
              <div className="signal-grid">{signals.map(([type, text, time, tone]) => <article className={`signal ${tone}`} key={type}><strong><i />{type}</strong><p>{text}</p><span>{time}</span></article>)}</div>
            </DashboardPanel>

            <DashboardPanel title="Sector News & AI Insights" action={<a href="#">View All →</a>}>
              <div className="news-list">
                <article><i>↗</i><div><div><strong>India&apos;s engineering exports rise 7% in Apr&apos;24</strong><b>Positive</b></div><small>Business Standard · 2h ago</small><p>Strong global demand from the US and Europe is driving export growth, benefiting engineering and capital goods companies.</p><a href="#">Read Full Analysis →</a></div></article>
                <article><i>✚</i><div><div><strong>USFDA approvals surge for Indian pharma companies</strong><b>Positive</b></div><small>Economic Times · 5h ago</small><p>Record approvals improve the export outlook for quality-focused mid-sized pharmaceutical businesses.</p><a href="#">Read Full Analysis →</a></div></article>
              </div>
            </DashboardPanel>
          </div>

          <aside className="dashboard-side-column">
            <AiDailyBriefPanel />

            <DashboardPanel title="Upcoming Events" action={<a href="#">View All →</a>}>
              <div className="event-list">{[
                ["Founder Meet: ABC Engineering", "22 May · 5:00 PM IST"],
                ["SME IPO Pipeline Call", "24 May · 11:00 AM IST"],
                ["Capital Market Roundtable", "30 May · 4:00 PM IST"],
                ["Investor Networking Meet", "5 Jun · 6:30 PM IST"],
              ].map(([title, date]) => <article key={title}><i><AppIcon name="calendar" size={13} /></i><div><strong>{title}</strong><span>{date}</span></div><button type="button">Register</button></article>)}</div>
            </DashboardPanel>
          </aside>
        </div>
      </div>
    </main>
  </div>;
}
