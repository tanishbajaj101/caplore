import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

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
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    pie: (
      <>
        <path d="M21 12a9 9 0 1 1-9-9v9z" />
        <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z" />
      </>
    ),
    activity: <path d="M3 12h4l2.5-7 4.5 14 2.5-7H21" />,
    signal: (
      <>
        <path d="M5 20V14M10 20V10M15 20V6M20 20V3" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z" />,
    folder: (
      <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z" />
        <path d="m18.5 13 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 14l.7 1.8 1.8.7-1.8.7L5.5 19l-.7-1.8-1.8-.7 1.8-.7z" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
      </>
    ),
    bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1z" />
    ),
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l5 5v15H6z" />
        <path d="M14 2v6h5M9 13h6M9 17h6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const navGroups: {
  label?: string;
  items: { label: string; icon: IconName; badge?: string; active?: boolean }[];
}[] = [
  {
    items: [
      { label: "Dashboard", icon: "grid" },
      { label: "Opportunities", icon: "briefcase", badge: "42", active: true },
      { label: "My Portfolio", icon: "pie" },
      { label: "Research & Insights", icon: "book" },
      { label: "Sector Intelligence", icon: "activity" },
      { label: "CAPLORE Signals", icon: "signal" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Community", icon: "users" },
      { label: "Events & Webinars", icon: "calendar" },
    ],
  },
  {
    label: "Premium",
    items: [
      { label: "CAPLORE+", icon: "star", badge: "New" },
      { label: "Deal Rooms", icon: "briefcase" },
      { label: "Documents", icon: "folder" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Research", icon: "sparkles" },
      { label: "Watchlist", icon: "eye" },
    ],
  },
];

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
      <header className="panel-header">
        <h2>{title}</h2>
        {meta}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

const companyFacts = [
  ["Company Type", "Private Limited", ""],
  ["Incorporation Year", "2008", ""],
  ["Headquarters", "Pune, Maharashtra", ""],
  ["Employees", "1,240+", ""],
  ["Key Clients", "Tata, L&T, BEL, HAL", "blue"],
  ["Export Revenue", "34% of Revenue", "US, Germany, Japan"],
  ["Manufacturing Plants", "3 Facilities", "Pune, Nashik, Hosur"],
  ["Certifications", "AS9100D, IATF 16949", ""],
];

const scoreRows = [
  ["Financial Health", 90, "green"],
  ["Governance Quality", 82, "blue"],
  ["Management Credibility", 88, "green"],
  ["Market Opportunity", 85, "blue"],
  ["Scalability", 80, "blue"],
  ["IPO Readiness", 75, "amber"],
] as const;

function OverviewTab() {
  return (
    <>
      <Panel title="Business Overview">
        <div className="facts-grid">
          {companyFacts.map(([label, value, support]) => (
            <div className="fact-item" key={label}>
              <span>{label}</span>
              <strong className={support === "blue" ? "blue-text" : ""}>{value}</strong>
              {support && support !== "blue" && <small>{support}</small>}
            </div>
          ))}
        </div>
        <div className="about-business">
          <h3>About the Business</h3>
          <p>
            ABC Engineering Ltd. is a precision engineering manufacturer supplying
            mission-critical components to India&apos;s aerospace, defence, and
            automotive industries. Founded in 2008 by Ramesh Agarwal, the company
            has scaled from a single plant in Pune to three facilities with 1,240+
            employees and ₹218 Cr in annual revenue. The company holds long-term
            supply agreements with marquee OEMs and has consistently grown EBITDA
            margins above 18% over the last three years. With a clean balance sheet
            (D/E of 0.38x) and structured governance, ABC Engineering is targeting
            an NSE Emerge listing within 24–30 months.
          </p>
        </div>
      </Panel>

      <Panel title="CAPLORE Score Breakdown" meta={<span className="score-badge">Strong opportunity</span>}>
        <div className="score-layout">
          <div className="score-ring" aria-label="CAPLORE Score: 85 out of 100">
            <svg viewBox="0 0 90 90" aria-hidden="true">
              <circle cx="45" cy="45" r="36" className="score-ring-bg" />
              <circle cx="45" cy="45" r="36" className="score-ring-progress" />
            </svg>
            <strong>85</strong>
            <span>Score</span>
          </div>
          <div className="score-bars">
            {scoreRows.map(([label, score, color]) => (
              <div className="score-row" key={label}>
                <span>{label}</span>
                <div className="bar-track">
                  <i className={color} style={{ width: `${score}%` }} />
                </div>
                <strong>{score}</strong>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <section className="ai-view">
        <div className="ai-view-top">
          <div className="ai-icon">ϟ</div>
          <div>
            <span>CAPLORE AI</span>
            <h2>Investment View</h2>
          </div>
          <b>Positive</b>
        </div>
        <p>
          ABC Engineering is one of the stronger pre-IPO candidates on the platform.
          The combination of sticky OEM relationships, export diversification, and
          consistent EBITDA expansion creates a defensible growth story with limited
          customer concentration risk.
        </p>
        <div className="ai-observations">
          <div><i>01</i><span>Revenue visibility is high because BEL and HAL supply agreements cover more than 40% of the forward order book.</span></div>
          <div><i>02</i><span>Governance has improved since FY22 through independent directors, an active audit committee, and audited related-party disclosures.</span></div>
          <div><i>03</i><span>The key stated risk is promoter dilution from 72% to approximately 55% after the IPO, requiring careful investor communication.</span></div>
        </div>
      </section>
    </>
  );
}

const incomeRows = [
  ["Revenue", "108.2", "138.6", "174.4", "218.0"],
  ["YoY Growth", "—", "28.1% ↑", "25.8% ↑", "25.0% ↑"],
  ["Gross Profit", "38.2", "50.4", "64.0", "81.6"],
  ["Gross Margin", "35.3%", "36.4%", "36.7%", "37.4%"],
  ["EBITDA", "16.8", "22.4", "30.6", "40.1"],
  ["EBITDA Margin", "15.5%", "16.2%", "17.5%", "18.4%"],
  ["PAT", "8.4", "11.8", "17.2", "23.6"],
  ["PAT Margin", "7.8%", "8.5%", "9.9%", "10.8%"],
];

const balanceRows = [
  ["Total Assets", "86.2", "112.4", "148.6"],
  ["Total Equity", "48.4", "62.8", "84.0"],
  ["Total Debt", "24.0", "28.4", "31.8"],
  ["Debt / Equity", "0.50x", "0.45x", "0.38x"],
  ["Working Capital Days", "68", "62", "58"],
  ["Cash & Equivalents", "6.2", "9.8", "14.4"],
];

function FinancialsTab() {
  return (
    <>
      <Panel title="Income Statement" meta={<span className="panel-meta">₹ Crore</span>}>
        <DataTable
          headers={["Metric", "FY21", "FY22", "FY23", "FY24"]}
          rows={incomeRows}
          highlight="EBITDA"
          growth="YoY Growth"
        />
      </Panel>
      <Panel title="Balance Sheet Snapshot" meta={<span className="panel-meta">₹ Crore</span>}>
        <DataTable
          headers={["Metric", "FY22", "FY23", "FY24"]}
          rows={balanceRows}
          highlight="Debt / Equity"
        />
      </Panel>
    </>
  );
}

function DataTable({
  headers,
  rows,
  highlight,
  growth,
}: {
  headers: string[];
  rows: string[][];
  highlight?: string;
  growth?: string;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={row[0] === highlight ? "highlight-row" : ""} key={row[0]}>
              {row.map((cell, index) => (
                index === 0 ? <th scope="row" key={cell}>{cell}</th> : (
                  <td key={`${cell}-${index}`}>
                    {row[0] === growth && cell !== "—" ? <span className="growth-pill">{cell}</span> : cell}
                  </td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const promoters = [
  ["RA", "Ramesh Agarwal", "Founder & Managing Director · 22 years in precision engineering", "52.4%", "blue"],
  ["SA", "Sunita Agarwal", "Co-Promoter · Director — Operations", "19.6%", "purple"],
  ["VE", "Vertex Equity Partners", "Series A Investor (2019) · Exiting via IPO", "14.2%", "green"],
  ["ES", "Employee ESOP Pool", "Vested & Unvested — Management incentive", "5.8%", "amber"],
  ["PI", "Public / Pre-IPO Investors", "This raise + existing angel holders", "8.0%", "navy"],
];

function PromotersTab() {
  return (
    <Panel title="Promoters & Shareholding" meta={<span className="panel-meta">Current ownership · 100%</span>}>
      <div className="holder-list">
        {promoters.map(([initials, name, role, holding, color], index) => (
          <div className="holder-row" key={name}>
            <div className={`holder-avatar ${color}`}>{initials}</div>
            <div className="holder-copy">
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
            <div className="holding">
              <strong>{holding}</strong>
              <span>{index === 3 ? "Pool" : "Holding"}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const risks = [
  ["Customer Concentration", "Medium", "BEL, HAL, and Tata Motors contribute approximately 52% of revenue; losing one could materially affect revenue."],
  ["IPO Timeline Slippage", "Medium", "Regulatory delays, market conditions, or governance gaps could delay the targeted 24–30 month listing window."],
  ["Liquidity Risk", "High", "The pre-IPO position is illiquid and depends on listing for exit; the internal secondary desk may provide partial liquidity in Year 2."],
  ["Raw Material Volatility", "Low", "Steel and aluminium costs affect margin, partially mitigated by OEM pass-through clauses."],
];

const strengths = [
  ["Sticky OEM Relationships", "Multi-year BEL, HAL, and Tata supply agreements provide revenue visibility and pricing power."],
  ["Export Diversification", "34% of revenue comes from the US, Germany, and Japan."],
  ["Improving Balance Sheet", "Debt/equity declined from 0.50x to 0.38x over three years, with strong cash generation."],
  ["Governance Improvements", "Independent directors, an audit committee, and a structured ESOP support IPO readiness."],
];

function RisksTab() {
  return (
    <>
      <Panel title="Key Risks">
        <div className="risk-list">
          {risks.map(([title, level, description]) => (
            <div className={`risk-card ${level.toLowerCase()}`} key={title}>
              <span className="risk-dot" />
              <div><strong>{title}</strong><p>{description}</p></div>
              <b>{level}</b>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Key Strengths">
        <div className="strength-grid">
          {strengths.map(([title, description]) => (
            <div className="strength-card" key={title}>
              <span><Icon name="check" size={14} /></span>
              <div><strong>{title}</strong><p>{description}</p></div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

const comparableRows = [
  ["ABC Engineering (Pre-IPO)", "218", "18.4%", "~20x est.", "~12x est.", "480 (Pre-Money)"],
  ["Minda Industries", "4,840", "14.2%", "38x", "22x", "18,200"],
  ["Craftsman Automation", "3,420", "19.6%", "28x", "16x", "8,600"],
  ["Precision Camshafts", "810", "17.8%", "24x", "14x", "1,940"],
  ["Ramkrishna Forgings", "2,640", "20.1%", "22x", "13x", "5,800"],
];

function ComparablesTab() {
  return (
    <>
      <Panel title="Listed Peer Comparison" meta={<span className="panel-meta">FY24 data · ₹ Crore</span>}>
        <DataTable
          headers={["Company", "Revenue", "EBITDA %", "P/E", "EV/EBITDA", "Market Cap"]}
          rows={comparableRows}
          highlight="ABC Engineering (Pre-IPO)"
        />
      </Panel>
      <section className="valuation-note">
        <div>
          <span>ABC ENGINEERING VALUATION</span>
          <h2>Priced at a considered discount to listed peers</h2>
          <p>
            At a ₹480 Cr pre-money valuation and ₹218 Cr revenue, ABC Engineering
            trades below listed peers at 14–22x EV/EBITDA. This discount typically
            compresses as the business approaches listing.
          </p>
        </div>
        <div className="valuation-metrics">
          <div><strong>2.2x</strong><span>Revenue</span></div>
          <div><strong>12x</strong><span>EV / EBITDA</span></div>
        </div>
      </section>
    </>
  );
}

const documents = [
  ["Investment Teaser — ABC Engineering Ltd.", "PDF · 2.4 MB", false],
  ["Audited Financials FY22, FY23, FY24", "PDF · 8.1 MB", false],
  ["Investor Pitch Deck (June 2025)", "PDF · 4.8 MB", false],
  ["Draft DRHP — Restricted Access", "Pending · Available after expression of interest", true],
  ["Legal Due Diligence Report", "Locked · Available post verification", true],
] as const;

function DocumentsTab() {
  return (
    <Panel title="Deal Documents" meta={<span className="access-badge"><Icon name="check" size={12} /> NDA Signed · Access Granted</span>}>
      <div className="document-list">
        {documents.map(([title, detail, locked]) => (
          <div className={`document-row ${locked ? "locked" : ""}`} key={title}>
            <div className="document-icon"><Icon name={locked ? "lock" : "file"} /></div>
            <div>
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
            <button type="button" disabled={locked} aria-label={`${locked ? "Locked" : "Download"} ${title}`}>
              {!locked && <Icon name="download" size={15} />}
              {locked ? "Locked" : "Download"}
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const milestones = [
  ["Governance Setup Complete", "done", "Dec 2023"],
  ["Statutory Audit (FY24) Filed", "done", "May 2024"],
  ["Merchant Banker Appointed", "done", "Mar 2025"],
  ["Pre-IPO Fundraise (Current Round)", "current", "Closes Jun 2025"],
  ["DRHP Filing with SEBI", "upcoming", "Sep 2025"],
  ["SEBI Observations Received", "upcoming", "Dec 2025"],
  ["Roadshow & Anchor Booking", "upcoming", "Mar 2026"],
  ["NSE Emerge Listing", "upcoming", "Apr 2026"],
];

function TimelineTab() {
  return (
    <Panel title="IPO Readiness Timeline" meta={<span className="panel-meta">Target listing · Apr 2026</span>}>
      <div className="timeline">
        {milestones.map(([title, state, date]) => (
          <div className={`timeline-item ${state}`} key={title}>
            <span className="timeline-dot">{state === "done" && <Icon name="check" size={11} />}</span>
            <div><strong>{title}</strong><span>{date}</span></div>
            <b>{state === "done" ? "Completed" : state === "current" ? "In progress" : "Upcoming"}</b>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SideRail() {
  const details = [
    ["Deal Type", "Pre-IPO Equity", "blue"],
    ["Target Raise", "₹120 Crore", ""],
    ["Min. Ticket", "₹25 Lakh", ""],
    ["Pre-Money Valuation", "₹480 Crore", ""],
    ["Instrument", "Compulsory Convertible Debentures (CCD)", ""],
    ["Conversion", "Auto-converts at IPO", ""],
    ["Expected IPO", "NSE Emerge · Apr 2026", ""],
    ["Lock-In Period", "6 months post-listing", ""],
    ["Close Date", "30 June 2025", ""],
    ["Merchant Banker", "SBI Capital Markets", "blue"],
  ];

  return (
    <aside className="side-rail" aria-label="Deal actions and details">
      <Panel title="Express Interest" className="interest-panel">
        <label htmlFor="investment-amount">Enter investment amount</label>
        <div className="amount-field">
          <span>₹</span>
          <input id="investment-amount" defaultValue="25,00,000" inputMode="numeric" />
        </div>
        <button className="primary-action" type="button">Express Interest <span>→</span></button>
        <p className="interest-note">Minimum ₹25 Lakh · Closes 30 Jun 2025</p>
        <div className="or-divider"><span>or</span></div>
        <button className="secondary-action" type="button"><Icon name="phone" size={15} /> Schedule a Call with Team</button>
        <div className="social-proof">
          <div className="investor-avatars">
            {["A", "R", "K", "M"].map((name) => <span key={name}>{name}</span>)}
          </div>
          <p><strong>28 investors</strong> have expressed interest</p>
        </div>
      </Panel>

      <Panel title="Deal Details">
        <dl className="deal-details">
          {details.map(([label, value, color]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={color === "blue" ? "blue-text" : ""}>{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Raise Progress">
        <div className="raise-head">
          <div><span>Raised</span><strong>₹74 Cr</strong></div>
          <div><span>Target</span><strong>₹120 Cr</strong></div>
        </div>
        <div className="raise-track"><i /></div>
        <div className="raise-percent"><span>62% funded</span><span>₹46 Cr remaining</span></div>
        <div className="raise-metrics">
          <div><strong>28</strong><span>Investors</span></div>
          <div><strong>12</strong><span>Days Left</span></div>
          <div><strong>₹2.6 Cr</strong><span>Avg. Ticket</span></div>
        </div>
      </Panel>
    </aside>
  );
}

const statItems = [
  ["Revenue (FY24)", "₹218 Cr", ""],
  ["EBITDA Margin", "18.4%", "positive"],
  ["Revenue CAGR (3Y)", "27.2%", "positive"],
  ["Debt / Equity", "0.38x", ""],
  ["Pre-Money Valuation", "₹480 Cr", ""],
  ["Expected IPO", "24–30 Mo", "warning"],
];

function DashboardApp() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="dealroom-app">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-mark">C</div>
          <div><strong>Caplore</strong><span>Investor Network</span></div>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navGroups.map((group, groupIndex) => (
            <div className="nav-group" key={group.label ?? "primary"}>
              {group.label && <p>{group.label}</p>}
              {group.items.map((item) => (
                <button className={`nav-item ${item.active ? "active" : ""}`} type="button" key={item.label}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && <b className={item.badge === "New" ? "new" : ""}>{item.badge}</b>}
                </button>
              ))}
              {groupIndex < navGroups.length - 1 && <div className="nav-separator" />}
            </div>
          ))}
        </nav>
        <div className="referral-card">
          <strong>Refer & Earn <span>🎁</span></strong>
          <p>Invite investors and earn rewards</p>
          <button type="button">Refer Now</button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs" aria-label="Breadcrumb">
            <span>Dashboard</span><i>/</i><span>Opportunities</span><i>/</i><strong>ABC Engineering Ltd.</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" aria-label="Share opportunity"><Icon name="share" /></button>
            <button type="button" aria-label="Save opportunity"><Icon name="bookmark" /></button>
            <button type="button" className="notification-button" aria-label="Notifications, 12 unread">
              <Icon name="bell" /><b>12</b>
            </button>
            <button type="button" className="user-chip" aria-label="Open user menu">
              <span>DR</span>
              <div><strong>Dinesh R.</strong><small>Premium Investor</small></div>
              <Icon name="chevron" size={15} />
            </button>
          </div>
        </header>

        <main className="deal-content">
          <section className="deal-hero">
            <div className="hero-main">
              <div className="company-summary">
                <div className="company-heading">
                  <div className="company-logo">AB</div>
                  <div>
                    <h1>ABC Engineering Ltd.</h1>
                    <p>Industrial Machinery <i>·</i> Pune, Maharashtra <i>·</i> Est. 2008</p>
                  </div>
                </div>
                <p className="company-description">
                  Leading manufacturer of precision engineering components for aerospace,
                  defence, and automotive OEMs. Strong export revenues, consistent EBITDA
                  margins, and an NSE Emerge listing on track within 24–30 months.
                </p>
                <div className="deal-badges">
                  <span className="pre-ipo">ϟ Pre-IPO</span>
                  <span className="score">✓ CAPLORE Score 85/100</span>
                  <span className="risk">⚠ Moderate Risk</span>
                  <span>Industrial Machinery</span>
                </div>
              </div>
              <div className="hero-investment">
                <div className="hero-investment-box">
                  <span>Target Raise</span>
                  <strong>₹120 Cr</strong>
                  <small>Min. ticket ₹25 Lakh · Closes 30 Jun 2025</small>
                  <button type="button">Express Interest</button>
                </div>
                <button className="watchlist-button" type="button"><Icon name="bookmark" size={15} /> Save to Watchlist</button>
              </div>
            </div>
            <div className="hero-stats">
              {statItems.map(([label, value, emphasis]) => (
                <div key={label}><span>{label}</span><strong className={emphasis}>{value}</strong></div>
              ))}
            </div>
          </section>

          <div className="deal-tabs" role="tablist" aria-label="Deal information">
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
            <div
              className="tab-panels"
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "financials" && <FinancialsTab />}
              {activeTab === "promoters" && <PromotersTab />}
              {activeTab === "risks" && <RisksTab />}
              {activeTab === "comparables" && <ComparablesTab />}
              {activeTab === "documents" && <DocumentsTab />}
              {activeTab === "timeline" && <TimelineTab />}
            </div>
            <SideRail />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardApp;
