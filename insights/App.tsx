import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { AIAnalysisView } from "./components/AIAnalysisView";
import { ArticleView } from "./components/ArticleView";
import { KeywordsView } from "./components/KeywordsView";
import { SectorImpactView } from "./components/SectorImpactView";
import { TopBar } from "./components/TopBar";
import { Act } from "./data/workflowData";

const views: Record<Act, () => React.JSX.Element> = {
  1: ArticleView,
  2: KeywordsView,
  3: SectorImpactView,
  4: AIAnalysisView,
};

const AUTO_ADVANCE_DELAY = 6000;

export default function App() {
  const [activeAct, setActiveAct] = useState<Act>(1);
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState === "visible",
  );
  const autoAdvanceScrollY = useRef<number | null>(null);
  const ActiveView = views[activeAct];

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isPageVisible) return;

    const timeout = window.setTimeout(() => {
      autoAdvanceScrollY.current = window.scrollY;
      setActiveAct((currentAct) => ((currentAct % 4) + 1) as Act);
    }, AUTO_ADVANCE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [activeAct, isPageVisible]);

  useLayoutEffect(() => {
    const lockedScrollY = autoAdvanceScrollY.current;
    if (lockedScrollY === null) return;

    autoAdvanceScrollY.current = null;
    if (window.matchMedia("(min-width: 769px)").matches) return;

    const restoreScroll = () => {
      window.scrollTo({ top: lockedScrollY, behavior: "auto" });
    };

    restoreScroll();
    const firstFrame = window.requestAnimationFrame(restoreScroll);
    const lockInterval = window.setInterval(restoreScroll, 50);
    const releaseLock = window.setTimeout(() => {
      window.clearInterval(lockInterval);
    }, 700);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(lockInterval);
      window.clearTimeout(releaseLock);
    };
  }, [activeAct]);

  return (
    <section className="insights-component" aria-labelledby="market-lens-title">
      <div className="lens-container">
        <header className="lens-intro">
          <div className="lens-tag">Daily AI Intelligence</div>
          <h2 id="market-lens-title">From raw news to investment insight.</h2>
          <p>
            See how CAPLORE AI extracts Indian market signals, discovers affected
            NSE and BSE companies, and produces a decision-ready view.
          </p>
        </header>
        <div className="lens-workspace">
          <TopBar activeAct={activeAct} onChange={setActiveAct} />
          <main className="lens-content">
            <LayoutGroup id="market-workflow">
              <AnimatePresence mode="popLayout">
                <motion.div
                  className="view-transition"
                  key={activeAct}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <ActiveView />
                </motion.div>
              </AnimatePresence>
            </LayoutGroup>
          </main>
        </div>
      </div>
    </section>
  );
}
