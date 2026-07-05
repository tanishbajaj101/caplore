export type CompanyTone = "blue" | "green" | "amber" | "purple" | "navy";
export type RiskLevel = "Low" | "Medium" | "Moderate" | "High";
export type TimelineState = "done" | "current" | "upcoming";

export type CompanySummary = {
  slug: string;
  initials: string;
  name: string;
  sector: string;
  location: string;
  established: string;
  opportunityType: string;
  tagTone: CompanyTone;
  art: string;
  targetRaise: string;
  minimumTicket: string;
  timeline: string;
  score: number;
  risk: RiskLevel;
  color: string;
  teaser: string;
};

export type DataTableSection = {
  title: string;
  meta: string;
  headers: string[];
  rows: string[][];
  highlight?: string;
  growth?: string;
};

export type CompanyData = {
  summary: CompanySummary;
  hero: {
    description: string;
    closeDate: string;
    stats: Array<{
      label: string;
      value: string;
      emphasis?: "positive" | "warning";
    }>;
  };
  overview: {
    facts: Array<{
      label: string;
      value: string;
      support?: string;
      highlight?: boolean;
    }>;
    about: string;
    scoreLabel: string;
    scores: Array<{
      label: string;
      score: number;
      color: "green" | "blue" | "amber";
    }>;
    investmentView: {
      sentiment: string;
      summary: string;
      observations: string[];
    };
  };
  financials?: {
    incomeStatement: DataTableSection;
    balanceSheet: DataTableSection;
  };
  ownership?: {
    meta: string;
    holders: Array<{
      initials: string;
      name: string;
      role: string;
      holding: string;
      color: CompanyTone;
      holdingLabel?: string;
    }>;
  };
  analysis?: {
    risks: Array<{
      title: string;
      level: RiskLevel;
      description: string;
    }>;
    strengths: Array<{
      title: string;
      description: string;
    }>;
  };
  comparables?: {
    table: DataTableSection;
    valuation: {
      eyebrow: string;
      title: string;
      description: string;
      metrics: Array<{ value: string; label: string }>;
    };
  };
  documents?: {
    accessLabel: string;
    items: Array<{
      title: string;
      detail: string;
      locked: boolean;
    }>;
  };
  timeline?: {
    meta: string;
    milestones: Array<{
      title: string;
      state: TimelineState;
      date: string;
    }>;
  };
  investment?: {
    amountDefault: string;
    minimumNote: string;
    investorInitials: string[];
    interestedInvestors: number;
    details: Array<{
      label: string;
      value: string;
      highlight?: boolean;
    }>;
    raiseProgress: {
      raised: string;
      target: string;
      percent: number;
      remaining: string;
      investors: string;
      daysLeft: string;
      averageTicket: string;
    };
  };
};
