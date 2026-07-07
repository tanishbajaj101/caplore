import { useEffect, useMemo, useState } from "react";
import { AppSidebar, AppSidebarToggle } from "./AppSidebar";
import { loadCompanyIndex } from "./companies/companyData";
import type { CompanySummary } from "./companies/types";
import { useSidebarState } from "./useSidebarState";

const filters = ["All Deals", "Pre-IPO", "Growth Capital", "Private Placement", "CCDs / NCDs", "Secondary", "Syndicate"];

export default function CompaniesApp() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Deals");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useSidebarState();

  useEffect(() => {
    let active = true;

    void loadCompanyIndex()
      .then((loadedCompanies) => {
        if (active) setCompanies(loadedCompanies);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not load companies.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const visibleCompanies = useMemo(
    () => companies.filter(
      (company) => activeFilter === "All Deals" || company.opportunityType === activeFilter,
    ),
    [activeFilter, companies],
  );

  return (
    <div className={`companies-page ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AppSidebar activeItem="opportunities" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="companies-shell app-page-shell">
        <header className="companies-header">
          <AppSidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
          <nav><a href="/dashboard">Dashboard</a><a className="active" href="/companies">Companies</a></nav>
        </header>

        <main>
        <section className="companies-intro">
          <h1>Companies</h1>
        </section>

        <div className="companies-filters" aria-label="Filter companies">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? "active" : ""} type="button" onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        {loading && <p className="companies-state">Loading companies…</p>}
        {error && <p className="companies-state error">{error}</p>}
        {!loading && !error && (
          <section className="companies-grid" aria-label="Available companies">
            {visibleCompanies.map((company) => (
              <article className="company-directory-card" key={company.slug}>
                <div className="directory-card-heading">
                  <i style={{ color: company.color, background: `${company.color}18` }}>{company.initials}</i>
                  <div><span>{company.opportunityType}</span><h2>{company.name}</h2><p>{company.sector}</p></div>
                </div>
                <p>{company.teaser}</p>
                <dl>
                  <div><dt>Raise</dt><dd>{company.targetRaise}</dd></div>
                  <div><dt>Min. ticket</dt><dd>{company.minimumTicket}</dd></div>
                  <div><dt>Score</dt><dd>{company.score}/100</dd></div>
                </dl>
                <a href={`/companies/${company.slug}`}>View company →</a>
              </article>
            ))}
            {visibleCompanies.length === 0 && <p className="companies-state companies-empty">No companies are available in this category yet.</p>}
          </section>
        )}
        </main>
      </div>
    </div>
  );
}
