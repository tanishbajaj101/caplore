import { motion } from "motion/react";
import { keywordCards } from "../data/workflowData";

export function KeywordsView() {
  return (
    <section className="view keywords-view" aria-label="Structured market insights">
      <motion.div className="keyword-shell" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="insights-heading">
          <div>
            <div className="section-kicker">Structured insights</div>
            <h2 className="stage-title">News converted into market signals.</h2>
            <p className="stage-subtitle">Extracted evidence is cleaned and organized by market effect, affected area, and timeframe.</p>
          </div>
        </div>
        <motion.div className="insight-pipeline" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16 } } }}>
          {["Evidence extracted", "Entities resolved", "Market effects structured"].map((step, index) => (
            <motion.div key={step} className="pipeline-step" variants={{ hidden: { opacity: 0.35 }, show: { opacity: 1 } }}>
              <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.18 + index * 0.16, type: "spring" }}>✓</motion.i>
              <span>{step}</span>
              {index < 2 && <b aria-hidden="true" />}
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="keyword-grid" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: 0.38, staggerChildren: 0.13 } } }}>
          {keywordCards.map((card, index) => (
            <motion.article
              className={`keyword-card ${card.tone}`}
              key={card.signal}
              layoutId={`insight-${card.source}`}
              variants={{ hidden: { opacity: 1 }, show: { opacity: 1 } }}
              transition={{ layout: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }}
              whileHover={{ y: -3 }}
            >
              <div className="insight-card-top">
                <motion.span className="insight-source" layoutId={`evidence-${card.source}`}>
                  {card.source}
                </motion.span>
                <motion.span className={`effect-pill ${card.tone}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + index * 0.04 }}>
                  {card.effect} · {card.timeframe}
                </motion.span>
              </div>
              <motion.div className="insight-card-content" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.04, duration: 0.38 }}>
                <h3 className="insight-title">{card.signal}</h3>
                <div className="insight-detail">
                  <span>Affected area</span>
                  <strong>{card.area}</strong>
                </div>
                <div className="insight-why">
                  <span>Why it matters</span>
                  <p>{card.why}</p>
                </div>
                <div className="insight-evidence">“{card.evidence}”</div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
