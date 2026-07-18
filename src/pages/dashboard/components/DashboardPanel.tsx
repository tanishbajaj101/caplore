import type { ReactNode } from "react";

export function DashboardPanel({ title, action, children }: { title: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="dashboard-panel">
      <header className="dashboard-panel-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

