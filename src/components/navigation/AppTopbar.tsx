import type { ReactNode } from "react";
import type { AuthUser } from "../../auth/storage";
import { AppSidebarToggle } from "./AppSidebar";
import { AppIcon } from "./AppIcon";

export function AppTopbar({
  accountOpen,
  title,
  initials,
  sidebarOpen,
  user,
  requestCount = 0,
  notificationCount = 0,
  onLogout,
  onOpenPasswordForm,
  onToggleAccount,
  onToggleSidebar,
}: {
  accountOpen: boolean;
  title: ReactNode;
  initials: string;
  sidebarOpen: boolean;
  user: AuthUser;
  requestCount?: number;
  notificationCount?: number;
  onLogout: () => void;
  onOpenPasswordForm?: () => void;
  onToggleAccount: () => void;
  onToggleSidebar: () => void;
}) {
  const badgeCount = requestCount + notificationCount;
  return (
    <header className="app-topbar">
      <AppSidebarToggle open={sidebarOpen} onToggle={onToggleSidebar} />
      <div className="app-topbar-title">{title}</div>
      <label className="app-topbar-search"><AppIcon name="search" size={14} /><input type="search" placeholder="Search companies, sectors, deals, reports..." /></label>
      <button className="notification-button" type="button" aria-label="Notifications"><AppIcon name="bell" size={15} />{badgeCount > 0 && <span>{badgeCount}</span>}</button>
      <div className="account-wrap">
        <button className="account-chip" type="button" onClick={onToggleAccount} aria-expanded={accountOpen}>
          <i>{initials}</i>
          <div><strong>{user.name || user.username || "Investor"}</strong><small>Caplore member</small></div>
          <AppIcon name="chevron" size={12} />
        </button>
        {accountOpen && (
          <div className="account-menu">
            {user.email && <span>{user.email}</span>}
            {onOpenPasswordForm && <button className="change-password" type="button" onClick={onOpenPasswordForm}>Change password</button>}
            <button type="button" onClick={onLogout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
