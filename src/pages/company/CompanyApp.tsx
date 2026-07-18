import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { readStoredUser } from "../../auth/storage";
import { AppSidebar, AppSidebarToggle } from "../../components/navigation/AppSidebar";
import { useSidebarState } from "../../hooks/useSidebarState";
import { loadCompany } from "../../companies/companyData";
import type {
  CompanyData,
  DataTableSection,
  TimelineState,
} from "../../companies/types";

type IconName =
  | "grid"
  | "briefcase"
  | "pie"
  | "book"
  | "activity"
  | "signal"
  | "users"
  | "calendar"
  | "star"
  | "folder"
  | "sparkles"
  | "eye"
  | "share"
  | "bookmark"
  | "bell"
  | "chevron"
  | "phone"
  | "download"
  | "lock"
  | "file"
  | "check";

function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    pie: <><path d="M21 12a9 9 0 1 1-9-9v9z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15z" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z" /></>,
    activity: <path d="M3 12h4l2.5-7 4.5 14 2.5-7H21" />,
    signal: <path d="M5 20V14M10 20V10M15 20V6M20 20V3" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z" />,
    folder: <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    sparkles: <><path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z" /><path d="m18.5 13 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 14l.7 1.8 1.8.7-1.8.7L5.5 19l-.7-1.8-1.8-.7 1.8-.7z" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" /><circle cx="12" cy="12" r="2.5" /></>,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
    bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1z" />,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    file: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5M9 13h6M9 17h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "promoters", label: "Promoters" },
  { id: "risks", label: "Risks & Strengths" },
  { id: "comparables", label: "Comparables" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "IPO Timeline" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Panel({
  title,
  meta,
  children,
  className = "",
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`deal-panel ${className}`}>
      <header className="panel-header"><h2>{title}</h2>{meta}</header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function PendingPanel({ section }: { section: string }) {
  return (
    <Panel title={section}>
      <div className="company-data-pending">
        <strong>Data pending</strong>
        <p>Add this section to the company JSON file when verified information is available.</p>
      </div>
    </Panel>
  );
}

function OverviewTab({ company }: { company: CompanyData }) {
  const { overview, summary } = company;
  const scoreOffset = 226.2 * (1 - summary.score / 100);

  return (
    <>
      <Panel title="Business Overview">
        <div className="facts-grid">
          {overview.facts.map((fact) => (
            <div className="fact-item" key={fact.label}>
              <span>{fact.label}</span>
              <strong className={fact.highlight ? "blue-text" : ""}>{fact.value}</strong>
              {fact.support && <small>{fact.support}</small>}
            </div>
          ))}
        </div>
        <div className="about-business">
          <h3>About the Business</h3>
          <p>{overview.about}</p>
        </div>
      </Panel>

      <Panel title="CAPLORE Score Breakdown" meta={<span className="score-badge">{overview.scoreLabel}</span>}>
        <div className="score-layout">
          <div className="score-ring" aria-label={`CAPLORE Score: ${summary.score} out of 100`}>
            <svg viewBox="0 0 90 90" aria-hidden="true">
              <circle cx="45" cy="45" r="36" className="score-ring-bg" />
              <circle cx="45" cy="45" r="36" className="score-ring-progress" style={{ strokeDashoffset: scoreOffset }} />
            </svg>
            <strong>{summary.score}</strong>
            <span>Score</span>
          </div>
          {overview.scores.length > 0 ? (
            <div className="score-bars">
              {overview.scores.map((row) => (
                <div className="score-row" key={row.label}>
                  <span>{row.label}</span>
                  <div className="bar-track"><i className={row.color} style={{ width: `${row.score}%` }} /></div>
                  <strong>{row.score}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="company-data-pending compact"><p>Score breakdown pending.</p></div>
          )}
        </div>
      </Panel>

      <section className="ai-view">
        <div className="ai-view-top">
          <div className="ai-icon">✦</div>
          <div><span>CAPLORE AI</span><h2>Investment View</h2></div>
          <b>{overview.investmentView.sentiment}</b>
        </div>
        <p>{overview.investmentView.summary}</p>
        {overview.investmentView.observations.length > 0 && (
          <div className="ai-observations">
            {overview.investmentView.observations.map((observation, index) => (
              <div key={observation}><i>{String(index + 1).padStart(2, "0")}</i><span>{observation}</span></div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function DataTable({ section }: { section: DataTableSection }) {
  return (
    <Panel title={section.title} meta={<span className="panel-meta">{section.meta}</span>}>
      <div className="table-wrap">
        <table>
          <thead><tr>{section.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>
            {section.rows.map((row) => (
              <tr className={row[0] === section.highlight ? "highlight-row" : ""} key={row[0]}>
                {row.map((cell, index) => index === 0
                  ? <th scope="row" key={cell}>{cell}</th>
                  : <td key={`${cell}-${index}`}>{row[0] === section.growth && cell !== "—" ? <span className="growth-pill">{cell}</span> : cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function FinancialsTab({ company }: { company: CompanyData }) {
  if (!company.financials) return <PendingPanel section="Financials" />;
  return <><DataTable section={company.financials.incomeStatement} /><DataTable section={company.financials.balanceSheet} /></>;
}

function PromotersTab({ company }: { company: CompanyData }) {
  if (!company.ownership) return <PendingPanel section="Promoters & Shareholding" />;
  return (
    <Panel title="Promoters & Shareholding" meta={<span className="panel-meta">{company.ownership.meta}</span>}>
      <div className="holder-list">
        {company.ownership.holders.map((holder) => (
          <div className="holder-row" key={holder.name}>
            <div className={`holder-avatar ${holder.color}`}>{holder.initials}</div>
            <div className="holder-copy"><strong>{holder.name}</strong><span>{holder.role}</span></div>
            <div className="holding"><strong>{holder.holding}</strong><span>{holder.holdingLabel ?? "Holding"}</span></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RisksTab({ company }: { company: CompanyData }) {
  if (!company.analysis) return <PendingPanel section="Risks & Strengths" />;
  return (
    <>
      <Panel title="Key Risks">
        <div className="risk-list">
          {company.analysis.risks.map((risk) => (
            <div className={`risk-card ${risk.level.toLowerCase()}`} key={risk.title}>
              <span className="risk-dot" />
              <div><strong>{risk.title}</strong><p>{risk.description}</p></div>
              <b>{risk.level}</b>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Key Strengths">
        <div className="strength-grid">
          {company.analysis.strengths.map((strength) => (
            <div className="strength-card" key={strength.title}>
              <span><Icon name="check" size={14} /></span>
              <div><strong>{strength.title}</strong><p>{strength.description}</p></div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ComparablesTab({ company }: { company: CompanyData }) {
  if (!company.comparables) return <PendingPanel section="Comparables" />;
  return (
    <>
      <DataTable section={company.comparables.table} />
      <section className="valuation-note">
        <div>
          <span>{company.comparables.valuation.eyebrow}</span>
          <h2>{company.comparables.valuation.title}</h2>
          <p>{company.comparables.valuation.description}</p>
        </div>
        <div className="valuation-metrics">
          {company.comparables.valuation.metrics.map((metric) => (
            <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}

function DocumentsTab({ company }: { company: CompanyData }) {
  if (!company.documents) return <PendingPanel section="Documents" />;
  return (
    <Panel title="Company Documents" meta={<span className="access-badge"><Icon name="check" size={12} /> {company.documents.accessLabel}</span>}>
      <div className="document-list">
        {company.documents.items.map((document) => (
          <div className={`document-row ${document.locked ? "locked" : ""}`} key={document.title}>
            <div className="document-icon"><Icon name={document.locked ? "lock" : "file"} /></div>
            <div><strong>{document.title}</strong><span>{document.detail}</span></div>
            <button type="button" disabled={document.locked} aria-label={`${document.locked ? "Locked" : "Download"} ${document.title}`}>
              {!document.locked && <Icon name="download" size={15} />}
              {document.locked ? "Locked" : "Download"}
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function milestoneLabel(state: TimelineState) {
  if (state === "done") return "Completed";
  if (state === "current") return "In progress";
  return "Upcoming";
}

function TimelineTab({ company }: { company: CompanyData }) {
  if (!company.timeline) return <PendingPanel section="IPO Timeline" />;
  return (
    <Panel title="IPO Readiness Timeline" meta={<span className="panel-meta">{company.timeline.meta}</span>}>
      <div className="timeline">
        {company.timeline.milestones.map((milestone) => (
          <div className={`timeline-item ${milestone.state}`} key={milestone.title}>
            <span className="timeline-dot">{milestone.state === "done" && <Icon name="check" size={11} />}</span>
            <div><strong>{milestone.title}</strong><span>{milestone.date}</span></div>
            <b>{milestoneLabel(milestone.state)}</b>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SideRail({ company }: { company: CompanyData }) {
  const { investment, summary, hero } = company;
  const details = investment?.details ?? [
    { label: "Opportunity Type", value: summary.opportunityType },
    { label: "Target Raise", value: summary.targetRaise },
    { label: "Minimum Ticket", value: summary.minimumTicket },
    { label: "Timeline", value: summary.timeline },
  ];

  return (
    <aside className="side-rail" aria-label="Opportunity actions and details">
      <Panel title="Express Interest" className="interest-panel">
        <label htmlFor="investment-amount">Enter investment amount</label>
        <div className="amount-field"><span>₹</span><input id="investment-amount" defaultValue={investment?.amountDefault ?? ""} inputMode="numeric" /></div>
        <button className="primary-action" type="button">Express Interest <span>→</span></button>
        <p className="interest-note">{investment?.minimumNote ?? `Minimum ${summary.minimumTicket} · ${hero.closeDate}`}</p>
        <div className="or-divider"><span>or</span></div>
        <button className="secondary-action" type="button"><Icon name="phone" size={15} /> Schedule a Call with Team</button>
        {investment && (
          <div className="social-proof">
            <div className="investor-avatars">{investment.investorInitials.map((name) => <span key={name}>{name}</span>)}</div>
            <p><strong>{investment.interestedInvestors} investors</strong> have expressed interest</p>
          </div>
        )}
      </Panel>

      <Panel title="Opportunity Details">
        <dl className="deal-details">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd className={detail.highlight ? "blue-text" : ""}>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {investment && (
        <Panel title="Raise Progress">
          <div className="raise-head">
            <div><span>Raised</span><strong>{investment.raiseProgress.raised}</strong></div>
            <div><span>Target</span><strong>{investment.raiseProgress.target}</strong></div>
          </div>
          <div className="raise-track"><i style={{ width: `${investment.raiseProgress.percent}%` }} /></div>
          <div className="raise-percent"><span>{investment.raiseProgress.percent}% funded</span><span>{investment.raiseProgress.remaining}</span></div>
          <div className="raise-metrics">
            <div><strong>{investment.raiseProgress.investors}</strong><span>Investors</span></div>
            <div><strong>{investment.raiseProgress.daysLeft}</strong><span>Days Left</span></div>
            <div><strong>{investment.raiseProgress.averageTicket}</strong><span>Avg. Ticket</span></div>
          </div>
        </Panel>
      )}
    </aside>
  );
}

function CompanyTemplate({ company }: { company: CompanyData }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const user = readStoredUser();
  const displayName = user.name || user.username || "Investor";
  const userInitials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const { summary, hero } = company;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className={`company-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AppSidebar activeItem="opportunities" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-shell app-page-shell">
        <header className="topbar">
          <AppSidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
          <div className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/dashboard">Dashboard</a><i>/</i><a href="/companies">Companies</a><i>/</i><strong>{summary.name}</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" aria-label="Share opportunity"><Icon name="share" /></button>
            <button type="button" aria-label="Save opportunity"><Icon name="bookmark" /></button>
            <button type="button" className="notification-button" aria-label="Notifications, 12 unread"><Icon name="bell" /><b>12</b></button>
            <button type="button" className="user-chip" aria-label="Open user menu">
              <span>{userInitials}</span><div><strong>{displayName}</strong><small>Caplore member</small></div><Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="deal-content">
          <section className="deal-hero">
            <div className="hero-main">
              <div className="company-summary">
                <div className="company-heading">
                  <div className="company-logo" style={{ color: summary.color, background: `${summary.color}18` }}>{summary.initials}</div>
                  <div><h1>{summary.name}</h1><p>{summary.sector} <i>·</i> {summary.location} <i>·</i> Est. {summary.established}</p></div>
                </div>
                <p className="company-description">{hero.description}</p>
                <div className="deal-badges">
                  <span className="pre-ipo">✦ {summary.opportunityType}</span>
                  <span className="score">✓ CAPLORE Score {summary.score}/100</span>
                  <span className="risk">⚠ {summary.risk} Risk</span>
                  <span>{summary.sector}</span>
                </div>
              </div>
              <div className="hero-investment">
                <div className="hero-investment-box">
                  <span>Target Raise</span><strong>{summary.targetRaise}</strong>
                  <small>Min. ticket {summary.minimumTicket} · Closes {hero.closeDate}</small>
                  <button type="button">Express Interest</button>
                </div>
                <button className="watchlist-button" type="button"><Icon name="bookmark" size={15} /> Save to Watchlist</button>
              </div>
            </div>
            <div className="hero-stats">
              {hero.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong className={stat.emphasis ?? ""}>{stat.value}</strong></div>)}
            </div>
          </section>

          <div className="deal-tabs" role="tablist" aria-label="Company information">
            {tabs.map((tab, index) => (
              <button
                ref={(node) => { tabRefs.current[index] = node; }}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={activeTab === tab.id ? "active" : ""}
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="deal-body">
            <div className="tab-panels" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
              {activeTab === "overview" && <OverviewTab company={company} />}
              {activeTab === "financials" && <FinancialsTab company={company} />}
              {activeTab === "promoters" && <PromotersTab company={company} />}
              {activeTab === "risks" && <RisksTab company={company} />}
              {activeTab === "comparables" && <ComparablesTab company={company} />}
              {activeTab === "documents" && <DocumentsTab company={company} />}
              {activeTab === "timeline" && <TimelineTab company={company} />}
            </div>
            <SideRail company={company} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CompanyApp({ slug }: { slug: string }) {
  const [company, setCompany] = useState<CompanyData | null>();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setCompany(undefined);
    setError("");

    void loadCompany(slug)
      .then((loadedCompany) => {
        if (!active) return;
        setCompany(loadedCompany);
        if (loadedCompany) document.title = `${loadedCompany.summary.name} · Caplore`;
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Could not load company data.");
      });

    return () => { active = false; };
  }, [slug]);

  if (error) {
    return <main className="company-load-state"><h1>Company unavailable</h1><p>{error}</p><a href="/companies">Back to companies</a></main>;
  }
  if (company === undefined) {
    return <main className="company-load-state"><p>Loading company…</p></main>;
  }
  if (company === null) {
    return <main className="company-load-state"><h1>Company not found</h1><p>No company data exists for “{slug}”.</p><a href="/companies">Browse companies</a></main>;
  }

  return <CompanyTemplate company={company} />;
}
