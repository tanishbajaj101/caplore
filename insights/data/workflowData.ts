export type Act = 1 | 2 | 3 | 4;

export const navItems: { id: Act; label: string }[] = [
  { id: 1, label: "Article" },
  { id: 2, label: "Insights" },
  { id: 3, label: "Company discovery" },
  { id: 4, label: "AI analysis" },
];

export const sectionDescriptions: Record<Act, string> = {
  1: "A live article is cleaned and its market-relevant evidence is extracted in real time.",
  2: "Extracted evidence becomes structured market effects, affected areas, and clear investor context.",
  3: "The analysis engine queries the knowledge graph for affected companies, then filters irrelevant matches.",
  4: "The company universe resolves into written AI analysis and an investor-facing verdict.",
};

export const processingSteps = [
  "Article loaded",
  "Market terms detected",
  "Keyword candidates ranked",
  "Extraction ready",
];

export const keywordCards = [
  {
    source: "RBI repo rate cut",
    category: "Monetary policy",
    signal: "Policy rate reduced",
    effect: "Positive",
    tone: "positive",
    timeframe: "Near term",
    area: "Banks, NBFCs and housing finance",
    why: "Can lower borrowing costs and stimulate loan demand.",
    evidence: "The RBI reduced the policy repo rate by 25 basis points.",
  },
  {
    source: "System liquidity",
    category: "Funding driver",
    signal: "Funding conditions ease",
    effect: "Positive",
    tone: "positive",
    timeframe: "Near term",
    area: "Bank and NBFC funding",
    why: "Improves liquidity access and may reduce funding costs.",
    evidence: "The central bank announced additional liquidity support.",
  },
  {
    source: "Bank credit growth",
    category: "Demand theme",
    signal: "Loan demand may strengthen",
    effect: "Mixed",
    tone: "mixed",
    timeframe: "Medium term",
    area: "Retail and corporate lending",
    why: "Higher volumes may be partly offset by narrower lending spreads.",
    evidence: "Lower rates improve the outlook for credit growth.",
  },
  {
    source: "HDFC Bank / SBI",
    category: "NSE entities",
    signal: "Named company exposure",
    effect: "Direct",
    tone: "direct",
    timeframe: "Immediate",
    area: "HDFC Bank and State Bank of India",
    why: "Both NSE-listed banks are directly exposed to policy transmission.",
    evidence: "The report highlights potential effects on HDFC Bank and SBI.",
  },
];

// The Article evidence chips and Insight cards intentionally share one source
// of truth so their labels and shared-layout IDs cannot drift apart.
export const articleKeywords = keywordCards.map(({ source, category }) => ({
  label: source,
  type: category,
}));

export type GraphNodeData = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  relevant?: boolean;
  kind: "keyword" | "company";
};

export const graphNodes: GraphNodeData[] = [
  { id: "policy", title: "Repo rate cut", subtitle: "Positive · Near term", x: 8, y: 12, kind: "keyword" },
  { id: "liquidity", title: "Liquidity support", subtitle: "Positive · Near term", x: 5, y: 36, kind: "keyword" },
  { id: "credit", title: "Credit growth", subtitle: "Mixed · Medium term", x: 7, y: 62, kind: "keyword" },
  { id: "entities", title: "Named exposure", subtitle: "Direct · Immediate", x: 10, y: 84, kind: "keyword" },
  { id: "hdfc", title: "HDFCBANK", subtitle: "HDFC Bank Ltd", x: 88, y: 9, relevant: true, kind: "company" },
  { id: "sbi", title: "SBIN", subtitle: "State Bank of India", x: 91, y: 31, relevant: true, kind: "company" },
  { id: "bajaj", title: "BAJFINANCE", subtitle: "Bajaj Finance Ltd", x: 90, y: 56, relevant: true, kind: "company" },
  { id: "lichf", title: "LICHSGFIN", subtitle: "LIC Housing Finance Ltd", x: 86, y: 81, relevant: true, kind: "company" },
  { id: "canbk", title: "CANBK", subtitle: "Canara Bank", x: 73, y: 6, kind: "company" },
  { id: "pnb", title: "PNB", subtitle: "Punjab National Bank", x: 77, y: 25, kind: "company" },
  { id: "federal", title: "FEDERALBNK", subtitle: "Federal Bank Ltd", x: 79, y: 47, kind: "company" },
  { id: "chola", title: "CHOLAFIN", subtitle: "Cholamandalam Finance", x: 77, y: 70, kind: "company" },
  { id: "mahindra", title: "M&MFIN", subtitle: "Mahindra Finance", x: 65, y: 84, kind: "company" },
  { id: "rec", title: "RECLTD", subtitle: "REC Ltd", x: 66, y: 13, kind: "company" },
];

export const graphLinks = [
  { d: "M 132 72 C 260 82 330 142 425 188", type: "keyword" },
  { d: "M 124 157 C 255 158 340 174 425 195", type: "keyword" },
  { d: "M 128 257 C 260 242 340 220 425 204", type: "keyword" },
  { d: "M 145 342 C 270 302 350 242 425 211", type: "keyword" },
  { d: "M 535 192 C 640 125 755 79 884 55", type: "relevant" },
  { d: "M 538 198 C 655 175 790 147 912 140", type: "relevant" },
  { d: "M 538 205 C 660 220 795 245 904 245", type: "relevant" },
  { d: "M 534 212 C 640 272 758 325 866 342", type: "relevant" },
  { d: "M 525 187 C 590 122 650 70 736 46", type: "muted" },
  { d: "M 532 195 C 615 157 690 118 775 108", type: "muted" },
  { d: "M 538 202 C 630 202 710 204 795 205", type: "muted" },
  { d: "M 534 210 C 620 252 700 287 778 294", type: "muted" },
  { d: "M 516 217 C 555 282 600 334 660 350", type: "muted" },
  { d: "M 513 184 C 555 120 600 73 662 55", type: "muted" },
];

export const analysisCards = [
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    badge: "Direct",
    tone: "direct",
    text: "Direct policy exposure. Stronger retail and corporate loan demand is supportive, while faster repricing of loans could pressure near-term margins.",
  },
  {
    ticker: "SBIN",
    name: "State Bank of India",
    badge: "Direct",
    tone: "direct",
    text: "Direct policy beneficiary. A broad deposit franchise and improving system liquidity may support growth, partly offset by margin normalization.",
  },
  {
    ticker: "BAJFINANCE",
    name: "Bajaj Finance",
    badge: "Exposure",
    tone: "exposure",
    text: "Lower wholesale funding costs and stronger consumer borrowing are positive, although credit quality must be watched as loan growth accelerates.",
  },
  {
    ticker: "LICHSGFIN",
    name: "LIC Housing Finance",
    badge: "Indirect",
    tone: "positive",
    text: "Lower home-loan rates may improve housing demand and disbursements. The earnings benefit depends on how quickly funding costs decline.",
  },
];
