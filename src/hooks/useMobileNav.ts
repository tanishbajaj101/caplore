import { useEffect } from "react";

export function useMobileNav() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("nav");
    const toggle = document.querySelector<HTMLButtonElement>(".mobile-nav-toggle");
    if (!nav || !toggle) return;

    const setOpen = (open: boolean) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    const handleToggle = () => {
      setOpen(!nav.classList.contains("is-open"));
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!nav.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleLinkClick = () => setOpen(false);

    toggle.addEventListener("click", handleToggle);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      toggle.removeEventListener("click", handleToggle);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
      nav.querySelectorAll("a").forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);
}

