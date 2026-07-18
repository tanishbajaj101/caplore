import type { ReactNode } from "react";

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="community-card">
      <header className="community-card-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

