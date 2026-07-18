import { useEffect } from "react";
import { apiBaseUrl } from "../api/config";

export function usePremiumForm() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(".premium-form");
    if (!form) return;

    const status = form.querySelector<HTMLElement>(".premium-form-status");
    const button = form.querySelector<HTMLButtonElement>("[type='submit']");
    form.action = `${apiBaseUrl}/api/submissions`;

    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const countryCode = String(formData.get("country-code") ?? "");
      const nationalPhone = String(formData.get("phone") ?? "");

      if (status) {
        status.textContent = "Submitting...";
        status.dataset.state = "";
      }
      if (button) button.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: `${countryCode}${nationalPhone}`,
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Submission failed.");
        }

        form.reset();
        if (status) {
          status.textContent = "Thank you. Your details have been received.";
          status.dataset.state = "success";
        }
      } catch (error) {
        if (status) {
          status.textContent =
            error instanceof Error
              ? error.message
              : "Could not submit your details. Please try again.";
          status.dataset.state = "error";
        }
      } finally {
        if (button) button.disabled = false;
      }
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);
}

