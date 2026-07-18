import { motion } from "motion/react";
import { articleKeywords, processingSteps } from "../data/workflowData";

export function ProcessingPanel() {
  return (
    <aside className="article-processor" aria-label="Article processing status">
      <motion.div className="processor-panel" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
        <div className="note-label"><span className="status-live" />Live article processing</div>
        <p className="note-value">The model reads the article, marks market-relevant terms, and ranks them for extraction.</p>
        <div className="processing-status">
          {processingSteps.map((step, index) => (
            <motion.div className="status-row" key={step} initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + index * 0.52 }}>
              <motion.span className="status-dot" initial={{ scale: 0.7, backgroundColor: "#d1d5db" }} animate={{ scale: 1, backgroundColor: "#1e5eff" }} transition={{ delay: 0.55 + index * 0.52 }} />
              <span>{step}</span>
            </motion.div>
          ))}
        </div>
        <div className="progress-track">
          <motion.span className="progress-fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 2.4, ease: "easeInOut" }} />
        </div>
      </motion.div>
      <motion.div className="extracted-stack" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: 2.7, staggerChildren: 0.08 } } }}>
        <motion.div className="evidence-tray-heading" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          <span>Extracted evidence</span>
          <small>Ready for insights</small>
        </motion.div>
        <div className="evidence-chip-grid">
          {articleKeywords.map((keyword) => (
            <motion.div
              className="evidence-chip"
              key={keyword.label}
              layoutId={`insight-${keyword.label}`}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ layout: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }}
            >
              <span>{keyword.type}</span>
              <motion.strong layoutId={`evidence-${keyword.label}`}>
                {keyword.label}
              </motion.strong>
              <i aria-hidden="true">↗</i>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}
