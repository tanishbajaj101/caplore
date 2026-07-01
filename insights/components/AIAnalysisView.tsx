import { motion } from "motion/react";
import { analysisCards } from "../data/workflowData";
import { CompanyCard } from "./CompanyCard";

export function AIAnalysisView() {
  return (
    <section className="view analysis-view" aria-label="AI company analysis">
      <div className="analysis-layout">
        <motion.aside className="analysis-summary" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <div className="section-kicker">AI output</div>
          <h2 className="stage-title">Final analysis takes over.</h2>
          <p className="stage-subtitle">The company universe becomes a written, decision-ready readout.</p>
          <motion.div className="verdict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <span>Overall read</span>
            Directly named accelerator-exposed companies face sentiment risk, but the wider semiconductor read-through is mixed because cloud AI demand remains strong.
          </motion.div>
        </motion.aside>
        <motion.div className="analysis-grid" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: 0.3, staggerChildren: 0.12 } } }}>
          {analysisCards.map((card, index) => <CompanyCard key={card.ticker} card={card} index={index} />)}
        </motion.div>
      </div>
    </section>
  );
}
