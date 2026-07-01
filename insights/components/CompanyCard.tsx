import { motion } from "motion/react";
import { analysisCards } from "../data/workflowData";

type Card = (typeof analysisCards)[number];

export function CompanyCard({ card, index }: { card: Card; index: number }) {
  const words = card.text.split(" ");
  return (
    <motion.article className={`analysis-card ${card.tone}`} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
      <div className="card-head">
        <div><div className="ticker">{card.ticker}</div><div className="company-name">{card.name}</div></div>
        <span className={`badge ${card.tone}`}>{card.badge}</span>
      </div>
      <motion.p className="analysis-text" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: 0.8 + index * 0.08, staggerChildren: 0.018 } } }}>
        {words.map((word, wordIndex) => (
          <motion.span key={`${word}-${wordIndex}`} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>{word}{" "}</motion.span>
        ))}
      </motion.p>
    </motion.article>
  );
}
