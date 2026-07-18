import { useMemo } from "react";
import sourceHtml from "../../assets/legacy/caplore.html?raw";
import IpoLifecycleMotion from "../../components/ipo-lifecycle/IpoLifecycle";
import InvestorTestimonials from "../../components/investor-testimonials/InvestorTestimonials";
import { useMobileNav } from "../../hooks/useMobileNav";
import { usePhonePreview } from "../../hooks/usePhonePreview";
import { usePremiumForm } from "../../hooks/usePremiumForm";
import InsightsApp from "../insights/InsightsApp";
import "../insights/styles.css";

const journeyBlock =
  /<!-- JOURNEY -->[\s\S]*?(?=<hr class="divider">)/;
const insightsBlock =
  /<!-- AI INTELLIGENCE PROGRAMME[\s\S]*?<\/section>/;
const testimonialsBlock =
  /<!-- TESTIMONIALS -->[\s\S]*?(?=<!-- FOOTER -->)/;

function parseLegacyPage(html: string) {
  const styles = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const withoutScripts = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<button[^>]*>\s*Our Values\s*<\/button>/gi, "");
  const [beforeJourney, afterJourney = ""] = withoutScripts.split(journeyBlock);
  const [beforeInsights, afterInsights = ""] = afterJourney.split(insightsBlock);
  const [beforeTestimonials, afterTestimonials = ""] =
    afterInsights.split(testimonialsBlock);

  return {
    styles,
    beforeJourney,
    beforeInsights,
    beforeTestimonials,
    afterTestimonials,
  };
}

export default function App() {
  const page = useMemo(() => parseLegacyPage(sourceHtml), []);
  usePhonePreview();
  useMobileNav();
  usePremiumForm();

  return (
    <>
      <style>{page.styles}</style>
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeJourney }}
      />
      <hr className="divider" />
      <IpoLifecycleMotion />
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeInsights }}
      />
      <section id="programme" aria-label="Daily AI Intelligence">
        <InsightsApp />
      </section>
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.beforeTestimonials }}
      />
      <InvestorTestimonials />
      <div
        className="legacy-page-fragment"
        dangerouslySetInnerHTML={{ __html: page.afterTestimonials }}
      />
    </>
  );
}
