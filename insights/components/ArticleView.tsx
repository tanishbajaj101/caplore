import { motion } from "motion/react";
import { ProcessingPanel } from "./ProcessingPanel";

function Term({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.strong
      className="article-term"
      initial={{ backgroundSize: "0% 2px", color: "#4b5563" }}
      animate={{ backgroundSize: "100% 2px", color: "#0a0f1e" }}
      transition={{ delay, duration: 0.38, ease: "easeOut" }}
    >
      {children}
    </motion.strong>
  );
}

export function ArticleView() {
  return (
    <section className="view article-view" aria-label="News article processing">
      <div className="article-processing-layout">
        <motion.article className="article-card" initial={{ opacity: 0, y: 18, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65 }}>
          <motion.div className="article-paper-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            <span>Global Markets Daily</span><span>Technology Desk</span><span>Market close brief</span>
          </motion.div>
          <motion.div className="article-meta" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>June 18, 2026 · 08:40 AM ET · By Markets Desk</motion.div>
          <motion.h1 className="headline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <Term delay={0.65}>Advanced chips</Term> face fresh export curbs as <Term delay={0.9}>cloud AI demand</Term> accelerates
          </motion.h1>
          <div className="article-divider" />
          <motion.p className="article-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Regulators are preparing tighter controls on high-end accelerators, raising uncertainty for <Term delay={1.3}>semiconductor supply</Term> while hyperscalers continue to increase infrastructure spend.
          </motion.p>
          <motion.p className="article-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Analysts said the proposed restrictions could create a mixed read-through for the chip ecosystem: near-term sentiment pressure for export-sensitive names, but continued support from large cloud buyers racing to expand AI capacity.
          </motion.p>
          <motion.p className="article-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            The report specifically flagged potential effects on <Term delay={2.2}>TSMC and Nvidia</Term>, with second-order exposure across chip designers, foundries, and equipment-linked suppliers.
          </motion.p>
          <motion.div className="scan-beam" initial={{ top: "4%", opacity: 0 }} animate={{ top: ["4%", "4%", "96%"], opacity: [0, 0.75, 0] }} transition={{ duration: 2.8, times: [0, 0.08, 1], ease: "linear", delay: 0.4 }} />
        </motion.article>
        <ProcessingPanel />
      </div>
    </section>
  );
}
