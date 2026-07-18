import { useState } from "react";
import { useAiDailyBriefs, type DailyBrief } from "../../../hooks/useAiDailyBriefs";
import "./AiDailyBriefPanel.css";

function BoltIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m13 2-9 12h8l-1 8 9-12h-8z" />
    </svg>
  );
}

function formatTimeAgo(dateInput: string | Date | null): string {
  if (!dateInput) return "unknown";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function AiDailyBriefPanel() {
  const [briefFilter, setBriefFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedBrief, setSelectedBrief] = useState<DailyBrief | null>(null);
  const { briefs, loading, error, fetchBriefs } = useAiDailyBriefs(briefFilter, sortOrder);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Market":
        return { cls: "green", letter: "M" };
      case "Sectors":
        return { cls: "blue", letter: "S" };
      case "Pre-IPO":
        return { cls: "amber", letter: "P" };
      default:
        return { cls: "blue", letter: category.charAt(0).toUpperCase() };
    }
  };

  return (
    <section className="dashboard-panel">
      <header className="dashboard-panel-header">
        <h2>
          <span className="panel-icon-title">
            <BoltIcon size={14} /> AI Daily Brief
          </span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="sort-toggle-btn"
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"))}
          >
            {sortOrder === "DESC" ? "Newest First ↓" : "Oldest First ↑"}
          </button>
          <a href="#">View All →</a>
        </div>
      </header>

      <div className="dashboard-tabs compact">
        {["All", "Market", "Sectors", "Pre-IPO"].map((tab) => (
          <button
            className={briefFilter === tab ? "active" : ""}
            type="button"
            onClick={() => setBriefFilter(tab)}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="brief-loading-state">
          <span>Loading latest updates...</span>
        </div>
      ) : error ? (
        <div className="brief-error-state">
          <span>{error}</span>
          <button type="button" onClick={fetchBriefs}>Retry</button>
        </div>
      ) : briefs.length === 0 ? (
        <div className="brief-loading-state">
          <span>No updates for this category yet.</span>
        </div>
      ) : (
        <div className="brief-list">
          {briefs.map((brief) => {
            const theme = getCategoryTheme(brief.category);
            return (
              <article key={brief.article_id}>
                <header>
                  <i className={theme.cls}>{theme.letter}</i>
                  <strong>{brief.heading}</strong>
                  <small>{formatTimeAgo(brief.published_date || brief.created_at)}</small>
                  <b className={brief.sentiment === "Positive" ? "" : "neutral"}>
                    {brief.sentiment}
                  </b>
                </header>
                <p>
                  <strong>What Happened:</strong> {brief.summary}
                </p>
                <p>
                  <strong>CAPLORE Insight:</strong> {brief.impact}
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedBrief(brief);
                  }}
                >
                  View Full Brief →
                </a>
              </article>
            );
          })}
        </div>
      )}

      <footer className="ai-powered">
        <BoltIcon size={11} /> Powered by CAPLORE AI
      </footer>

      {selectedBrief && (
        <div className="brief-modal-overlay" onClick={() => setSelectedBrief(null)}>
          <div className="brief-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="brief-modal-header">
              <div className="brief-modal-header-text">
                <h3>{selectedBrief.heading}</h3>
                <div className="brief-modal-meta">
                  <span className={`brief-modal-category ${selectedBrief.category}`}>
                    {selectedBrief.category}
                  </span>
                  <small style={{ color: "#9ca3af" }}>
                    {formatTimeAgo(selectedBrief.published_date || selectedBrief.created_at)}
                  </small>
                </div>
              </div>
              <button
                className="brief-modal-close"
                type="button"
                onClick={() => setSelectedBrief(null)}
                aria-label="Close brief"
              >
                &times;
              </button>
            </div>
            <div className="brief-modal-body">
              <div className="brief-modal-section">
                <h4>What Happened</h4>
                <p>{selectedBrief.summary}</p>
              </div>
              <div className="brief-modal-section">
                <h4>CAPLORE Insight</h4>
                <p>{selectedBrief.impact}</p>
              </div>
              <div className="brief-modal-section brief-modal-detailed">
                <h4>Detailed Analysis</h4>
                <p>{selectedBrief.detailed_brief}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
