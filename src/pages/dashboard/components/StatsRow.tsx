import { AppIcon, type AppIconName } from "../../../components/navigation/AppIcon";

export type DashboardStat = {
  label: string;
  value: string;
  note: string;
  icon: AppIconName;
  tone: string;
  up?: boolean;
};

export function StatsRow({ stats }: { stats: DashboardStat[] }) {
  return (
    <section className="stat-row" aria-label="Portfolio overview">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <div><i className={stat.tone}><AppIcon name={stat.icon} size={14} /></i><span>{stat.label}</span></div>
          <strong>{stat.value}</strong>
          <small className={stat.up ? "up" : ""}>{stat.note}</small>
        </article>
      ))}
    </section>
  );
}

