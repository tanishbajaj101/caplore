import type { CompanySummary } from "../../../companies/types";
import { DashboardPanel } from "./DashboardPanel";

export function OpportunitiesPanel({
  dealsError,
  featuredDeals,
}: {
  dealsError: string;
  featuredDeals: CompanySummary[];
}) {
  return (
    <DashboardPanel title="Curated Opportunities" action={<a href="/companies">View All →</a>}>
      <div className="deal-strip">
        {featuredDeals.map((deal) => (
          <article className="opportunity-card" key={deal.name}>
            <div className="opportunity-copy">
              <span className={`deal-tag ${deal.tagTone}`}>{deal.opportunityType}</span>
              <div className="deal-company">
                <i style={{ color: deal.color, background: `${deal.color}18` }}>{deal.initials}</i>
                <div><strong>{deal.name}</strong><small>{deal.sector}</small></div>
              </div>
              <p>{deal.teaser}</p>
            </div>
            <div className="deal-art" style={{ background: `linear-gradient(135deg, ${deal.color}55, ${deal.color})` }}><b>{deal.art}</b><span>{deal.sector}</span></div>
            <div className="deal-metrics"><div><span>Target Raise</span><strong>{deal.targetRaise}</strong></div><div><span>Min. Ticket</span><strong>{deal.minimumTicket}</strong></div><div><span>Timeline</span><strong>{deal.timeline}</strong></div></div>
            <div className="deal-score"><strong>✓ Score {deal.score}/100</strong><span className={deal.risk === "Low" ? "low" : ""}>{deal.risk}</span></div>
            <a className="company-link" href={`/companies/${deal.slug}`}>View Company</a>
          </article>
        ))}
        {dealsError && <p className="empty-deals">{dealsError}</p>}
        {!dealsError && featuredDeals.length === 0 && <p className="empty-deals">More opportunities are coming soon.</p>}
      </div>
      <p className="deal-count">Showing the top {featuredDeals.length} companies</p>
    </DashboardPanel>
  );
}

