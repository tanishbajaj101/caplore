import { useState, type FormEvent } from "react";
import { apiBaseUrl } from "../api/config";
import type { AuthUser } from "../auth/storage";

export function useChangePassword(user: AuthUser, onAccountClose: () => void) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ state: "" | "error" | "success"; message: string }>({ state: "", message: "" });

  const openPasswordForm = () => {
    onAccountClose();
    setPasswordStatus({ state: "", message: "" });
    setPasswordOpen(true);
  };

  const closePasswordForm = () => {
    if (passwordSubmitting) return;
    setPasswordOpen(false);
    setPasswordStatus({ state: "", message: "" });
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const previousPassword = String(formData.get("previousPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ state: "error", message: "New passwords do not match." });
      return;
    }

    setPasswordSubmitting(true);
    setPasswordStatus({ state: "", message: "" });
    try {
      const response = await fetch(`${apiBaseUrl}/api/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token ?? ""}`,
        },
        body: JSON.stringify({ previousPassword, newPassword }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Could not change your password.");
      }

      form.reset();
      setPasswordStatus({ state: "success", message: "Password changed successfully." });
    } catch (error) {
      setPasswordStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not change your password.",
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return {
    passwordOpen,
    passwordSubmitting,
    passwordStatus,
    setPasswordOpen,
    openPasswordForm,
    closePasswordForm,
    changePassword,
  };
}
