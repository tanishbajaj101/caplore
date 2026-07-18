import { useEffect } from "react";

const previewCards = [
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

export function usePhonePreview() {
  useEffect(() => {
    const stack = document.getElementById("phoneCardStack");
    if (!stack) return;

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

      const cardData = previewCards[index % previewCards.length];
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

