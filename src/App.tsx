import { useEffect, useMemo } from "react";
import sourceHtml from "../caplore.html?raw";
import InsightsApp from "../insights/App";
import "../insights/styles.css";
import IpoLifecycleMotion from "./components/IpoLifecycle";
import InvestorTestimonials from "./components/InvestorTestimonials";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ??
  "https://caplore-backend-production.up.railway.app"
).replace(/\/$/, "");

const journeyBlock =
  /<!-- JOURNEY -->[\s\S]*?(?=<hr class="divider">)/;
const insightsBlock =
  /<!-- AI INTELLIGENCE PROGRAMME[\s\S]*?<\/section>/;
const testimonialsBlock =
  /<!-- TESTIMONIALS -->[\s\S]*?(?=<!-- CTA -->)/;

function parseLegacyPage(html: string) {
  const styles = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const withoutScripts = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<button[^>]*>\s*Our Values\s*<\/button>/gi, "");
  const [beforeJourney, afterJourney = ""] = withoutScripts.split(journeyBlock);
  const [beforeInsights, afterInsights = ""] = afterJourney.split(insightsBlock);
  const [beforeTestimonials, afterTestimonials = ""] =
    afterInsights.split(testimonialsBlock);

  return {
    styles,
    beforeJourney,
    beforeInsights,
    beforeTestimonials,
    afterTestimonials,
  };
}

function usePhonePreview() {
  useEffect(() => {
    const stack = document.getElementById("phoneCardStack");
    if (!stack) return;

    const cards = [
      {
        label: "Invested portfolio",
        value: "₹6.48 Cr",
        detail: "+12.35% total invested",
        color: "#34D399",
      },
      {
        label: "Live opportunities",
        value: "42",
        detail: "Pre-IPO and growth deals",
        color: "#60A5FA",
      },
      {
        label: "CAPLORE AI Daily Brief",
        value: "Manufacturing sector",
        detail: "Industrial production grew 5.2% YoY",
        color: "#FBBF24",
      },
      {
        label: "IPO signal",
        value: "ABC Engineering",
        detail: "Merchant banker appointed",
        color: "#34D399",
      },
    ];

    let index = 0;
    let active: HTMLElement[] = [];
    const timers: number[] = [];

    const cycle = () => {
      if (active.length >= 3) {
        const old = active.shift();
        if (old) {
          old.classList.remove("show");
          old.classList.add("hide");
          timers.push(window.setTimeout(() => old.remove(), 500));
        }
      }

      const cardData = cards[index % cards.length];
      const card = document.createElement("div");
      card.className = "phone-card";
      card.innerHTML = `
        <div class="phone-card-label">${cardData.label}</div>
        <div class="phone-card-value">${cardData.value}</div>
        <div class="phone-card-sub" style="color:${cardData.color}">${cardData.detail}</div>
      `;
      stack.appendChild(card);
      active.push(card);
      timers.push(window.setTimeout(() => card.classList.add("show"), 20));
      index += 1;
    };

    cycle();
    timers.push(window.setTimeout(cycle, 350));
    timers.push(window.setTimeout(cycle, 700));
    const interval = window.setInterval(cycle, 2600);

    return () => {
      window.clearInterval(interval);
      timers.forEach(window.clearTimeout);
      active.forEach((card) => card.remove());
      active = [];
    };
  }, []);
}

function usePremiumForm() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(".premium-form");
    if (!form) return;

    const status =
      form.querySelector<HTMLElement>(".premium-form-status");
    const button = form.querySelector<HTMLButtonElement>("[type='submit']");
    form.action = `${apiBaseUrl}/api/submissions`;

    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const countryCode = String(formData.get("country-code") ?? "");
      const nationalPhone = String(formData.get("phone") ?? "");

      if (status) {
        status.textContent = "Submitting…";
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

export default function App() {
  const page = useMemo(() => parseLegacyPage(sourceHtml), []);
  usePhonePreview();
  usePremiumForm();

  return (
    <>
      <style>{page.styles}</style>
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeJourney }}
      />
      <hr className="divider" />
      <IpoLifecycleMotion />
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeInsights }}
      />
      <section id="programme" aria-label="Daily AI Intelligence">
        <InsightsApp />
      </section>
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeTestimonials }}
      />
      <InvestorTestimonials />
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.afterTestimonials }}
      />
    </>
  );
}
