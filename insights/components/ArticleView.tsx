import { motion } from "motion/react";
import businessStandardLogo from "../../logos/business-standard.com-logo.webp";
import cnbcTv18Logo from "../../logos/cnbctv18.com-logo.webp";
import liveMintLogo from "../../logos/livemint.com-logo.webp";
import moneycontrolLogo from "../../logos/moneycontrol.com-logo.webp";
import ndtvProfitLogo from "../../logos/ndtvprofit.com-logo.webp";
import reutersLogo from "../../logos/reuters.com-logo.webp";
import { ProcessingPanel } from "./ProcessingPanel";

const newsLogos = [
  { src: reutersLogo, alt: "Reuters" },
  { src: moneycontrolLogo, alt: "Moneycontrol" },
  { src: liveMintLogo, alt: "Mint" },
  { src: cnbcTv18Logo, alt: "CNBC-TV18" },
  { src: ndtvProfitLogo, alt: "NDTV Profit" },
  { src: businessStandardLogo, alt: "Business Standard" },
];

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
            {newsLogos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt} />
            ))}
          </motion.div>
          <motion.h1 className="headline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <Term delay={0.65}>RBI repo rate cut</Term> lifts rate-sensitive stocks as <Term delay={0.9}>system liquidity</Term> improves
          </motion.h1>
          <div className="article-divider" />
          <motion.p className="article-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            The Reserve Bank of India reduced its policy rate by 25 basis points and announced liquidity support, improving the outlook for <Term delay={1.3}>bank credit growth</Term> and borrowing costs.
          </motion.p>
          <motion.p className="article-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Analysts expect lower funding costs to support lenders and NBFCs, although pressure on net interest margins could limit the benefit for banks with a high share of floating-rate loans.
          </motion.p>
          <motion.p className="article-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            The policy readout specifically highlighted <Term delay={2.2}>HDFC Bank and SBI</Term>, with second-order effects across consumer finance, housing finance, and other rate-sensitive NSE and BSE stocks.
          </motion.p>
          <motion.div className="scan-beam" initial={{ top: "4%", opacity: 0 }} animate={{ top: ["4%", "4%", "96%"], opacity: [0, 0.75, 0] }} transition={{ duration: 2.8, times: [0, 0.08, 1], ease: "linear", delay: 0.4 }} />
        </motion.article>
        <ProcessingPanel />
      </div>
    </section>
  );
}
