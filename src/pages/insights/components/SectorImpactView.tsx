import { motion } from "motion/react";
import { graphLinks, graphNodes } from "../data/workflowData";
import { GraphNode } from "./GraphNode";

export function SectorImpactView() {
  return (
    <section className="view sector-view" aria-label="Sector and company impact network">
      <motion.div className="network-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <div className="network-heading">
          <div>
            <div className="section-kicker">NSE-listed company discovery</div>
            <h2 className="network-title">The analysis engine finds affected NSE companies.</h2>
          </div>
        </div>
        <p className="network-caption">Structured market signals query actual NSE-listed companies. The engine retrieves affected-company candidates, processes relevance, then greys out weaker matches.</p>
        <div className="graph-shell">
          <svg className="graph-svg" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
            {graphLinks.map((link, index) => (
              <motion.path
                key={`${link.type}-${index}`}
                className={`graph-line ${link.type}`}
                d={link.d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={link.type === "muted" ? { pathLength: 1, opacity: [0, 0.55, 0.55, 0.08] } : { pathLength: 1, opacity: [0, 0.85, 0.85] }}
                transition={{ pathLength: { delay: 0.47 + index * 0.03, duration: 0.55 }, opacity: { delay: 0.47 + index * 0.03, duration: link.type === "muted" ? 3.1 : 0.87, times: link.type === "muted" ? [0, 0.16, 0.78, 1] : [0, 0.4, 1] } }}
              />
            ))}
          </svg>
          {graphNodes.map((node, index) => <GraphNode key={node.id} node={node} index={index} />)}
          <motion.div
            className="engine-node"
            transformTemplate={(_, generatedTransform) => `translate(-50%, -50%) ${generatedTransform}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.58, type: "spring", stiffness: 250, damping: 22 }}
          >
            <div className="engine-orbit" aria-hidden="true"><i /><i /><i /><i /></div>
            <span>Central discovery</span>
            <strong>Analysis Engine</strong>
            <em>Knowledge graph retrieval</em>
            <motion.small initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: 0.91, duration: 1.78, times: [0, 0.15, 0.8, 1] }}>
              Processing 10 matches…
            </motion.small>
          </motion.div>
        </div>
        <div className="graph-legend">
          <span><i className="legend-dot discovered" />NSE-listed candidate</span>
          <span><i className="legend-dot active" />Affected NSE company</span>
          <span><i className="legend-dot muted" />Filtered after processing</span>
        </div>
      </motion.div>
    </section>
  );
}
