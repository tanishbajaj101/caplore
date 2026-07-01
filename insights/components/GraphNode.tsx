import { motion } from "motion/react";
import { GraphNodeData } from "../data/workflowData";

export function GraphNode({ node, index }: { node: GraphNodeData; index: number }) {
  const isMuted = node.kind === "company" && !node.relevant;
  return (
    <motion.div
      className={`graph-node ${node.kind}-node ${node.relevant ? "relevant" : ""} ${isMuted ? "filtered" : ""}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      transformTemplate={(_, generatedTransform) => `translate(-50%, -50%) ${generatedTransform}`}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={isMuted
        ? { opacity: [0, 1, 1, 0.3], scale: [0.82, 1, 1, 0.96], filter: ["grayscale(0)", "grayscale(0)", "grayscale(0)", "grayscale(1)"] }
        : { opacity: [0, 1, 1], scale: [0.82, 1, 1] }}
      transition={{ duration: isMuted ? 3.34 : 1.96, delay: 0.18 + index * 0.03, times: isMuted ? [0, 0.14, 0.76, 1] : [0, 0.28, 1] }}
    >
      {isMuted ? (
        <span className="node-status-stack">
          <motion.b initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.72, duration: 0.18 }}>
            {node.subtitle}
          </motion.b>
          <motion.b className="filtered-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.83, duration: 0.22 }}>
            Filtered out
          </motion.b>
        </span>
      ) : <span>{node.subtitle}</span>}
      <strong>{node.title}</strong>
    </motion.div>
  );
}
