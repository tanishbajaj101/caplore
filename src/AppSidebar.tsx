type SidebarItemId =
  | "dashboard"
  | "opportunities"
  | "portfolio"
  | "research"
  | "community"
  | "events"
  | "premium";

type SidebarIconName =
  | "grid"
  | "briefcase"
  | "pie"
  | "book"
  | "users"
  | "calendar"
  | "star";

type AppSidebarProps = {
  activeItem: SidebarItemId;
  open: boolean;
  onClose: () => void;
};

type AppSidebarToggleProps = {
  open: boolean;
  onToggle: () => void;
};

const navGroups: {
  label?: string;
  items: {
    id: SidebarItemId;
    label: string;
    icon: SidebarIconName;
    href: string;
    badge?: string;
  }[];
}[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: "grid", href: "/dashboard" },
      { id: "opportunities", label: "Opportunities", icon: "briefcase", href: "/companies", badge: "42" },
      { id: "portfolio", label: "My Portfolio", icon: "pie", href: "#" },
      { id: "research", label: "Research & Insights", icon: "book", href: "#" },
    ],
  },
  {
    label: "Community",
    items: [
      { id: "community", label: "Community", icon: "users", href: "/community" },
      { id: "events", label: "Events & Webinars", icon: "calendar", href: "/community#events" },
    ],
  },
  {
    label: "Premium",
    items: [
      { id: "premium", label: "CAPLORE+", icon: "star", href: "/join", badge: "New" },
    ],
  },
];

function SidebarIcon({ name }: { name: SidebarIconName }) {
  const paths: Record<SidebarIconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    pie: <><path d="M21 12a9 9 0 1 1-9-9v9z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15z" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z" />,
  };

  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function AppSidebar({ activeItem, open, onClose }: AppSidebarProps) {
  return (
    <>
      <aside className="app-sidebar" id="app-sidebar" aria-label="Main navigation" aria-hidden={!open} inert={!open}>
        <a className="app-sidebar-brand" href="/dashboard" onClick={onClose}>
          <span className="app-sidebar-mark">C</span>
          <span><strong>Caplore</strong><small>Investor Network</small></span>
        </a>
        <nav className="app-sidebar-nav">
          {navGroups.map((group, groupIndex) => (
            <div className="app-sidebar-group" key={group.label ?? "primary"}>
              {group.label && <p>{group.label}</p>}
              {group.items.map((item) => (
                <a
                  className={`app-sidebar-item ${item.id === activeItem ? "active" : ""}`}
                  href={item.href}
                  key={item.id}
                  onClick={onClose}
                >
                  <SidebarIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && <b className={item.badge === "New" ? "new" : ""}>{item.badge}</b>}
                </a>
              ))}
              {groupIndex < navGroups.length - 1 && <div className="app-sidebar-separator" />}
            </div>
          ))}
        </nav>
      </aside>
      <button className="app-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />
    </>
  );
}

export function AppSidebarToggle({ open, onToggle }: AppSidebarToggleProps) {
  return (
    <button
      className="app-sidebar-toggle"
      type="button"
      aria-label={open ? "Collapse navigation" : "Expand navigation"}
      aria-controls="app-sidebar"
      aria-expanded={open}
      onClick={onToggle}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}
