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

export const articleKeywords = [
  { label: "Advanced chips", type: "Product / technology", delay: 1.05 },
  { label: "Cloud AI demand", type: "Demand driver", delay: 1.45 },
  { label: "Semiconductor supply", type: "Supply theme", delay: 2.15 },
  { label: "TSMC / Nvidia", queueLabel: "TSMC · NVDA", type: "Named entities", delay: 3.7 },
];

export const processingSteps = [
  "Article loaded",
  "Market terms detected",
  "Keyword candidates ranked",
  "Extraction ready",
];

export const keywordCards = [
  {
    source: "Advanced chips",
    signal: "Export restrictions",
    effect: "Negative",
    tone: "negative",
    timeframe: "Near term",
    area: "Advanced AI chips",
    why: "May restrict international accelerator sales.",
    evidence: "Fresh controls target high-end chip exports.",
  },
  {
    source: "Cloud AI demand",
    signal: "Cloud spending accelerates",
    effect: "Positive",
    tone: "positive",
    timeframe: "Medium term",
    area: "Advanced chips",
    why: "Supports continued infrastructure spending.",
    evidence: "Hyperscalers continue to increase infrastructure spend.",
  },
  {
    source: "Semiconductor supply",
    signal: "Supply uncertainty",
    effect: "Mixed",
    tone: "mixed",
    timeframe: "Near term",
    area: "Semiconductor supply",
    why: "Could support pricing while limiting shipment visibility.",
    evidence: "Policy changes add uncertainty across the chip ecosystem.",
  },
  {
    source: "TSMC / Nvidia",
    signal: "Named company exposure",
    effect: "Direct",
    tone: "direct",
    timeframe: "Immediate",
    area: "TSMC and Nvidia",
    why: "Both companies are explicitly linked to the developing catalyst.",
    evidence: "The report specifically flags potential effects on both firms.",
  },
];

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
  { id: "advanced", title: "Export restrictions", subtitle: "Negative · Near term", x: 8, y: 12, kind: "keyword" },
  { id: "cloud", title: "Cloud spending", subtitle: "Positive · Medium term", x: 5, y: 36, kind: "keyword" },
  { id: "supply", title: "Supply uncertainty", subtitle: "Mixed · Near term", x: 7, y: 62, kind: "keyword" },
  { id: "entities", title: "Named exposure", subtitle: "Direct · Immediate", x: 10, y: 84, kind: "keyword" },
  { id: "nvda", title: "NVDA", subtitle: "Direct impact", x: 88, y: 9, relevant: true, kind: "company" },
  { id: "tsm", title: "TSM", subtitle: "Supplier impact", x: 91, y: 31, relevant: true, kind: "company" },
  { id: "amd", title: "AMD", subtitle: "Adjacent impact", x: 90, y: 56, relevant: true, kind: "company" },
  { id: "txn", title: "TXN", subtitle: "Indirect impact", x: 86, y: 81, relevant: true, kind: "company" },
  { id: "avgo", title: "AVGO", subtitle: "Graph match", x: 73, y: 6, kind: "company" },
  { id: "qcom", title: "QCOM", subtitle: "Graph match", x: 77, y: 25, kind: "company" },
  { id: "mu", title: "MU", subtitle: "Graph match", x: 79, y: 47, kind: "company" },
  { id: "intc", title: "INTC", subtitle: "Graph match", x: 77, y: 70, kind: "company" },
  { id: "mrvl", title: "MRVL", subtitle: "Graph match", x: 65, y: 84, kind: "company" },
  { id: "on", title: "ON", subtitle: "Graph match", x: 66, y: 13, kind: "company" },
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
    ticker: "TSM",
    name: "Taiwan Semiconductor",
    badge: "Direct",
    tone: "direct",
    text: "Direct supply-chain mention. Export limits may pressure advanced-node visibility, but demand remains structurally supported.",
  },
  {
    ticker: "NVDA",
    name: "Nvidia",
    badge: "Direct",
    tone: "direct",
    text: "Named exposure to accelerator controls. Near-term sentiment risk rises, partly offset by resilient cloud AI spending.",
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    badge: "Exposure",
    tone: "exposure",
    text: "Sector-adjacent read-through. Competitive demand may improve, but policy uncertainty weighs on the broader chip group.",
  },
  {
    ticker: "TXN",
    name: "Texas Instruments",
    badge: "Indirect",
    tone: "positive",
    text: "Lower direct AI exposure. May act as a defensive semi name if investors rotate away from export-sensitive accelerators.",
  },
];
