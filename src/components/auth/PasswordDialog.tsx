import type { FormEvent } from "react";
import "./password-dialog.css";

export function PasswordDialog({
  status,
  submitting,
  onClose,
  onSubmit,
}: {
  status: { state: "" | "error" | "success"; message: string };
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="password-overlay" role="presentation" onMouseDown={onClose}>
      <form className="password-popover" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div><span>Account security</span><h2>Change password</h2></div>
          <button type="button" onClick={onClose} aria-label="Close change password">×</button>
        </header>
        <label>Previous password<input name="previousPassword" type="password" autoComplete="current-password" minLength={1} maxLength={200} required /></label>
        <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={200} required /></label>
        <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={200} required /></label>
        <p className="password-status" data-state={status.state} role="status" aria-live="polite">{status.message}</p>
        <footer>
          <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" disabled={submitting}>{submitting ? "Changing..." : "Change password"}</button>
        </footer>
      </form>
    </div>
  );
}
