import { motion } from "motion/react";
import { Act, navItems } from "../data/workflowData";

type Props = {
  activeAct: Act;
  onChange: (act: Act) => void;
};

export function TopBar({ activeAct, onChange }: Props) {
  return (
    <header className="topbar">
      <div className="brand"><span className="dot-live" />AI Market Lens</div>
      <nav className="act-nav" aria-label="Analysis workflow sections">
        {navItems.map((item) => (
          <motion.button
            type="button"
            key={item.id}
            className="lens-nav-btn"
            aria-current={activeAct === item.id ? "step" : undefined}
            onClick={() => onChange(item.id)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            {activeAct === item.id && (
              <motion.span className="nav-active" layoutId="active-tab" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            )}
            <span>{item.id}. {item.label}</span>
          </motion.button>
        ))}
      </nav>
    </header>
  );
}
