import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppSidebar, AppSidebarToggle } from "./AppSidebar";
import { loadCompanyIndex } from "./companies/companyData";
import type { CompanySummary } from "./companies/types";
import { useSidebarState } from "./useSidebarState";

const AUTH_STORAGE_KEY = "caplore_auth";

type AuthUser = { username?: string; name?: string; email?: string };
type IconName = "grid" | "search" | "chart" | "book" | "globe" | "bolt" | "users" | "calendar" | "star" | "briefcase" | "file" | "sparkles" | "eye" | "bell" | "shield" | "trend" | "chevron" | "menu";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chart: <path d="M6 20v-5m6 5V9m6 11V4" />,
    book: <><path d="M4 5a3 3 0 0 1 3-3h4v18H7a3 3 0 0 0-3 3z" /><path d="M20 5a3 3 0 0 0-3-3h-4v18h4a3 3 0 0 1 3 3z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8z" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
    file: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5" /></>,
    sparkles: <><path d="m12 3 1.2 3.3 3.3 1.2-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z" /><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" /><circle cx="12" cy="12" r="2.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const stats = [
  { label: "Invested", value: "₹6.48 Cr", note: "↑ 12.35%", icon: "shield" as IconName, tone: "blue", up: true },
  { label: "Valuation", value: "₹8.72 Cr", note: "↑ 18.74%", icon: "trend" as IconName, tone: "green", up: true },
  { label: "XIRR", value: "18.74%", note: "↑ 1.35x Multiple", icon: "chart" as IconName, tone: "green", up: true },
  { label: "Live Deals", value: "42", note: "Pre-IPO & Growth", icon: "search" as IconName, tone: "blue" },
  { label: "New This Week", value: "8", note: "Deals Added", icon: "calendar" as IconName, tone: "amber" },
  { label: "IPO Pipeline", value: "27", note: "SME IPOs Tracked", icon: "bolt" as IconName, tone: "blue" },
];

const signals = [
  ["Governance", "Independent Director resigned in XYZ Ltd.", "1h ago", "red"],
  ["Financial", "Receivables increased 40% in LMN Ltd.", "3h ago", "amber"],
  ["Valuation", "Peer valuation expanded 25% in sector", "5h ago", "green"],
  ["Fundraising", "PQR Components preparing pre-IPO round", "6h ago", "blue"],
  ["IPO Signal", "ABC Engineering appointed merchant banker", "8h ago", "purple"],
];

function readUser(): AuthUser {
  try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}") as AuthUser; }
  catch { return {}; }
}

function Panel({ title, action, children }: { title: ReactNode; action?: ReactNode; children: ReactNode }) {
  return <section className="dashboard-panel"><header className="dashboard-panel-header"><h2>{title}</h2>{action}</header>{children}</section>;
}

export default function DashboardHomeApp() {
  const user = useMemo(readUser, []);
  const [briefFilter, setBriefFilter] = useState("All");
  const [accountOpen, setAccountOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [deals, setDeals] = useState<CompanySummary[]>([]);
  const [dealsError, setDealsError] = useState("");
  const firstName = user.name?.trim().split(/\s+/)[0] || user.username || "Investor";
  const initials = (user.name || user.username || "Investor").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const featuredDeals = deals.slice(0, 6);
  const logout = () => { localStorage.removeItem(AUTH_STORAGE_KEY); window.location.assign("/"); };

  useEffect(() => {
    let active = true;
    void loadCompanyIndex()
      .then((companies) => {
        if (active) setDeals(companies);
      })
      .catch((reason: unknown) => {
        if (active) setDealsError(reason instanceof Error ? reason.message : "Could not load opportunities.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return <div className={`dashboard-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
    <AppSidebar activeItem="dashboard" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <main className="dashboard-shell app-page-shell">
      <header className="dashboard-topbar">
        <AppSidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
        <div className="dashboard-greeting"><h1>Good Morning, {firstName} 👋</h1></div>
        <label className="dashboard-search"><Icon name="search" size={14} /><input type="search" placeholder="Search companies, sectors, deals, reports…" /></label>
        <button className="notification-button" type="button" aria-label="Notifications"><Icon name="bell" size={15} /><span>12</span></button>
        <div className="account-wrap">
          <button className="account-chip" type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen}><i>{initials}</i><div><strong>{user.name || user.username || "Investor"}</strong><small>Caplore member</small></div><Icon name="chevron" size={12} /></button>
          {accountOpen && <div className="account-menu">{user.email && <span>{user.email}</span>}<button type="button" onClick={logout}>Log out</button></div>}
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stat-row" aria-label="Portfolio overview">{stats.map((stat) => <article className="stat-card" key={stat.label}><div><i className={stat.tone}><Icon name={stat.icon} size={14} /></i><span>{stat.label}</span></div><strong>{stat.value}</strong><small className={stat.up ? "up" : ""}>{stat.note}</small></article>)}</section>

        <div className="dashboard-grid">
          <div className="dashboard-main-column">
            <Panel title="Curated Opportunities" action={<a href="/companies">View All →</a>}>
              <div className="deal-strip">{featuredDeals.map((deal) => <article className="opportunity-card" key={deal.name}>
                <div className="opportunity-copy"><span className={`deal-tag ${deal.tagTone}`}>{deal.opportunityType}</span><div className="deal-company"><i style={{ color: deal.color, background: `${deal.color}18` }}>{deal.initials}</i><div><strong>{deal.name}</strong><small>{deal.sector}</small></div></div><p>{deal.teaser}</p></div>
                <div className="deal-art" style={{ background: `linear-gradient(135deg, ${deal.color}55, ${deal.color})` }}><b>{deal.art}</b><span>{deal.sector}</span></div>
                <div className="deal-metrics"><div><span>Target Raise</span><strong>{deal.targetRaise}</strong></div><div><span>Min. Ticket</span><strong>{deal.minimumTicket}</strong></div><div><span>Timeline</span><strong>{deal.timeline}</strong></div></div>
                <div className="deal-score"><strong>✓ Score {deal.score}/100</strong><span className={deal.risk === "Low" ? "low" : ""}>{deal.risk}</span></div>
                <a className="company-link" href={`/companies/${deal.slug}`}>View Company</a>
              </article>)}{dealsError && <p className="empty-deals">{dealsError}</p>}{!dealsError && featuredDeals.length === 0 && <p className="empty-deals">More opportunities are coming soon.</p>}</div>
              <p className="deal-count">Showing the top {featuredDeals.length} companies</p>
            </Panel>

            <Panel title={<span className="title-with-badge">CAPLORE Signals <b>AI Powered</b></span>} action={<a href="#">View All →</a>}>
              <div className="signal-grid">{signals.map(([type, text, time, tone]) => <article className={`signal ${tone}`} key={type}><strong><i />{type}</strong><p>{text}</p><span>{time}</span></article>)}</div>
            </Panel>

            <Panel title="Sector News & AI Insights" action={<a href="#">View All →</a>}>
              <div className="news-list">
                <article><i>↗</i><div><div><strong>India&apos;s engineering exports rise 7% in Apr&apos;24</strong><b>Positive</b></div><small>Business Standard · 2h ago</small><p>Strong global demand from the US and Europe is driving export growth, benefiting engineering and capital goods companies.</p><a href="#">Read Full Analysis →</a></div></article>
                <article><i>✚</i><div><div><strong>USFDA approvals surge for Indian pharma companies</strong><b>Positive</b></div><small>Economic Times · 5h ago</small><p>Record approvals improve the export outlook for quality-focused mid-sized pharmaceutical businesses.</p><a href="#">Read Full Analysis →</a></div></article>
              </div>
            </Panel>
          </div>

          <aside className="dashboard-side-column">
            <Panel title={<span className="panel-icon-title"><Icon name="bolt" size={14} /> AI Daily Brief</span>} action={<a href="#">View All →</a>}>
              <div className="dashboard-tabs compact">{["All", "Market", "Sectors", "Pre-IPO"].map((tab) => <button className={briefFilter === tab ? "active" : ""} type="button" onClick={() => setBriefFilter(tab)} key={tab}>{tab}</button>)}</div>
              <div className="brief-list">
                <article><header><i className="green">M</i><strong>Manufacturing</strong><small>2h ago</small><b>Positive</b></header><p><strong>What Happened:</strong> Industrial production grew 5.2% YoY.</p><p><strong>CAPLORE Insight:</strong> Focus on operating leverage and export exposure.</p><a href="#">View Full Brief →</a></article>
                <article><header><i className="blue">S</i><strong>SME IPO Market</strong><small>4h ago</small><b className="neutral">Neutral</b></header><p><strong>What Happened:</strong> Five SME companies filed DRHPs this week.</p><p><strong>CAPLORE Insight:</strong> Healthcare and engineering lead the pipeline.</p><a href="#">View Full Brief →</a></article>
                <article><header><i className="amber">P</i><strong>Pre-IPO Market</strong><small>6h ago</small><b>Positive</b></header><p><strong>What Happened:</strong> Three profitable SMEs entered advanced fundraising.</p><p><strong>CAPLORE Insight:</strong> Valuations are stabilising across sectors.</p><a href="#">View Full Brief →</a></article>
              </div>
              <footer className="ai-powered"><Icon name="bolt" size={11} /> Powered by CAPLORE AI</footer>
            </Panel>

            <Panel title="Upcoming Events" action={<a href="#">View All →</a>}>
              <div className="event-list">{[
                ["Founder Meet: ABC Engineering", "22 May · 5:00 PM IST"],
                ["SME IPO Pipeline Call", "24 May · 11:00 AM IST"],
                ["Capital Market Roundtable", "30 May · 4:00 PM IST"],
                ["Investor Networking Meet", "5 Jun · 6:30 PM IST"],
              ].map(([title, date]) => <article key={title}><i><Icon name="calendar" size={13} /></i><div><strong>{title}</strong><span>{date}</span></div><button type="button">Register</button></article>)}</div>
            </Panel>
          </aside>
        </div>
      </div>
    </main>
  </div>;
}
