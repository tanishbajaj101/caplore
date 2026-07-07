import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const SIDEBAR_STORAGE_KEY = "caplore_sidebar_open";

function getInitialSidebarState(): boolean {
  try {
    const storedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (storedState === "true") return true;
    if (storedState === "false") return false;
  } catch {
    // Fall back to the responsive default when storage is unavailable.
  }

  return window.matchMedia("(min-width: 901px)").matches;
}

export function useSidebarState(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [sidebarOpen, setSidebarOpenState] = useState(getInitialSidebarState);
  const sidebarOpenRef = useRef(sidebarOpen);

  const setSidebarOpen = useCallback<Dispatch<SetStateAction<boolean>>>((nextState) => {
    const nextOpen = typeof nextState === "function"
      ? nextState(sidebarOpenRef.current)
      : nextState;

    sidebarOpenRef.current = nextOpen;

    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextOpen));
    } catch {
      // The in-memory state still works when storage is unavailable.
    }

    setSidebarOpenState(nextOpen);
  }, []);

  useEffect(() => {
    const syncSidebarState = (event: StorageEvent) => {
      if (event.key !== SIDEBAR_STORAGE_KEY || (event.newValue !== "true" && event.newValue !== "false")) {
        return;
      }

      const nextOpen = event.newValue === "true";
      sidebarOpenRef.current = nextOpen;
      setSidebarOpenState(nextOpen);
    };

    window.addEventListener("storage", syncSidebarState);
    return () => window.removeEventListener("storage", syncSidebarState);
  }, []);

  return [sidebarOpen, setSidebarOpen];
}
