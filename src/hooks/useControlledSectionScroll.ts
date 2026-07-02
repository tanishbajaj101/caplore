import { useEffect } from "react";
import { animate, type AnimationPlaybackControlsWithThen } from "motion";

const SECTION_SELECTOR = "[data-scroll-section]";
const WHEEL_THRESHOLD = 18;
const EDGE_TOLERANCE = 8;
const INPUT_LOCK_RELEASE_MS = 140;

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
}

function getScrollableAncestor(
  target: EventTarget | null,
  direction: 1 | -1,
) {
  let element = target instanceof HTMLElement ? target : null;

  while (element && element !== document.body) {
    const { overflowY } = window.getComputedStyle(element);
    const canScroll =
      /(auto|scroll)/.test(overflowY) &&
      element.scrollHeight > element.clientHeight + 1;

    if (canScroll) {
      const hasRoom =
        direction > 0
          ? element.scrollTop + element.clientHeight <
            element.scrollHeight - EDGE_TOLERANCE
          : element.scrollTop > EDGE_TOLERANCE;

      if (hasRoom) return element;
    }

    element = element.parentElement;
  }

  return null;
}

export function useControlledSectionScroll() {
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotionQuery.matches) return;

    const root = document.documentElement;
    root.classList.add("controlled-section-scroll");

    let animation: AnimationPlaybackControlsWithThen | null = null;
    let releaseTimer = 0;
    let inputLocked = false;
    let wheelDelta = 0;
    let lastWheelAt = 0;
    let touchStartY: number | null = null;
    let touchHandled = false;

    const getSections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
      ).filter((section) => section.offsetParent !== null);

    const getNavOffset = () =>
      document.querySelector<HTMLElement>("nav")?.getBoundingClientRect()
        .height ?? 0;

    const getSectionTop = (section: HTMLElement) =>
      Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          window.scrollY +
            section.getBoundingClientRect().top -
            getNavOffset(),
        ),
      );

    const getStepDestination = (direction: 1 | -1) => {
      const sections = getSections();
      if (sections.length < 2) return null;

      const tops = sections.map(getSectionTop);
      const currentY = window.scrollY;
      let currentIndex = 0;

      for (let index = 0; index < tops.length; index += 1) {
        if (tops[index] <= currentY + EDGE_TOLERANCE) currentIndex = index;
        else break;
      }

      if (direction > 0) {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= tops.length) return null;

        const visibleHeight = window.innerHeight - getNavOffset();
        const currentRegionRemaining = tops[nextIndex] - currentY;

        // Keep native scrolling inside a block that cannot fit in one viewport.
        if (currentRegionRemaining > visibleHeight + EDGE_TOLERANCE) {
          return null;
        }

        return tops[nextIndex];
      }

      if (currentY > tops[currentIndex] + EDGE_TOLERANCE) return null;
      if (currentIndex === 0) return null;
      return tops[currentIndex - 1];
    };

    const releaseInput = () => {
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        inputLocked = false;
        root.removeAttribute("data-section-scrolling");
      }, INPUT_LOCK_RELEASE_MS);
    };

    const scrollTo = (destination: number) => {
      animation?.stop();
      window.clearTimeout(releaseTimer);
      inputLocked = true;
      root.setAttribute("data-section-scrolling", "true");

      animation = animate(window.scrollY, destination, {
        duration: 0.82,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => window.scrollTo(0, latest),
        onComplete: releaseInput,
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        isEditableTarget(event.target) ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        event.deltaY === 0
      ) {
        return;
      }

      if (inputLocked) {
        event.preventDefault();
        return;
      }

      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      if (getScrollableAncestor(event.target, direction)) return;

      const destination = getStepDestination(direction);
      if (destination === null) {
        wheelDelta = 0;
        return;
      }

      event.preventDefault();

      const now = performance.now();
      if (now - lastWheelAt > 180 || Math.sign(wheelDelta) !== direction) {
        wheelDelta = 0;
      }

      lastWheelAt = now;
      wheelDelta += event.deltaY;

      if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) return;

      wheelDelta = 0;
      scrollTo(destination);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || isEditableTarget(event.target)) return;
      touchStartY = event.touches[0].clientY;
      touchHandled = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || touchHandled || event.touches.length !== 1) {
        if (inputLocked) event.preventDefault();
        return;
      }

      const delta = touchStartY - event.touches[0].clientY;
      if (Math.abs(delta) < 24) return;

      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      if (getScrollableAncestor(event.target, direction)) return;

      const destination = getStepDestination(direction);
      if (destination === null) return;

      event.preventDefault();
      touchHandled = true;
      scrollTo(destination);
    };

    const handleTouchEnd = () => {
      touchStartY = null;
      touchHandled = false;
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      );
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", hash);
      scrollTo(getSectionTop(target));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("click", handleAnchorClick);

    return () => {
      animation?.stop();
      window.clearTimeout(releaseTimer);
      root.classList.remove("controlled-section-scroll");
      root.removeAttribute("data-section-scrolling");
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
}
