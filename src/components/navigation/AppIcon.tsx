import type { ReactNode } from "react";

export type AppIconName =
  | "grid"
  | "search"
  | "chart"
  | "book"
  | "globe"
  | "bolt"
  | "users"
  | "calendar"
  | "star"
  | "briefcase"
  | "file"
  | "sparkles"
  | "eye"
  | "bell"
  | "shield"
  | "trend"
  | "chevron"
  | "menu";

export function AppIcon({ name, size = 16 }: { name: AppIconName; size?: number }) {
  const paths: Record<AppIconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chart: <path d="M6 20v-5m6 5V9m6 11V4" />,
    book: <><path d="M4 5a3 3 0 0 1 3-3h4v18H7a3 3 0 0 0-3 3z" /><path d="M20 5a3 3 0 0 0-3-3h-4v18h4a3 3 0 0 1 3 3z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8z" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
    file: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5" /></>,
    sparkles: <><path d="m12 3 1.2 3.3 3.3 1.2-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z" /><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" /><circle cx="12" cy="12" r="2.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

