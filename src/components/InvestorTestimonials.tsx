import Marquee from "react-fast-marquee";
import "./InvestorTestimonials.css";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  initials: string;
  accent: "blue" | "green" | "amber" | "violet" | "rose";
};

const testimonials: Testimonial[] = [
  {
    quote:
      "CAPLORE has become the first place we check before taking a mandate to market. Its governance scoring saves our team weeks of preliminary diligence.",
    name: "Rajiv Kapoor",
    designation: "Managing Director, Merchant Banking",
    initials: "RK",
    accent: "blue",
  },
  {
    quote:
      "Having alpha, drawdown, and AUM in one screen instead of a dozen factsheets has changed how we underwrite managers for the family office.",
    name: "Anjali Mehta",
    designation: "Principal, Mehta Family Office",
    initials: "AM",
    accent: "green",
  },
  {
    quote:
      "The DRHP intelligence is the most useful research workflow I have used for SME IPOs. What took two days now takes our analysts minutes.",
    name: "Priya Deshmukh",
    designation: "Research Head, Institutional Desk",
    initials: "PD",
    accent: "amber",
  },
  {
    quote:
      "Early access through CAPLORE+ has been the difference between reading about a deal and actually having the opportunity to participate.",
    name: "Vikram Suri",
    designation: "Partner, Early-Stage Syndicate",
    initials: "VS",
    accent: "violet",
  },
  {
    quote:
      "The platform gives our investment committee one reliable view of opportunities, risk signals, and supporting documents before every meeting.",
    name: "Neha Bansal",
    designation: "Director, Private Investments",
    initials: "NB",
    accent: "rose",
  },
  {
    quote:
      "CAPLORE put our Category III fund in front of the right HNI and family office audience without forcing us to build that network from scratch.",
    name: "Sandeep Nair",
    designation: "Fund Manager, Category III AIF",
    initials: "SN",
    accent: "green",
  },
  {
    quote:
      "The quality of investor matching is meaningfully higher than anything we saw through cold outreach or generic deal-discovery platforms.",
    name: "Karan Thakur",
    designation: "Investment Banker, Growth Capital",
    initials: "KT",
    accent: "blue",
  },
  {
    quote:
      "For private-market research, speed only matters when the data is trustworthy. CAPLORE consistently gives us both.",
    name: "Rohan Malhotra",
    designation: "Chief Investment Officer, Single Family Office",
    initials: "RM",
    accent: "amber",
  },
  {
    quote:
      "The governance flags help us ask sharper questions early. That has made founder conversations more productive and our screening more consistent.",
    name: "Ishita Rao",
    designation: "Vice President, Alternative Investments",
    initials: "IR",
    accent: "rose",
  },
  {
    quote:
      "We can move from discovery to an investment memo without losing context. The workflow feels designed for how capital teams actually operate.",
    name: "Arjun Khanna",
    designation: "Partner, Emerging Markets Fund",
    initials: "AK",
    accent: "violet",
  },
];

const rows = [testimonials.slice(0, 5), testimonials.slice(5)];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="investor-testimonial-card">
      <div className="investor-testimonial-card__quote-mark" aria-hidden="true">
        “
      </div>
      <blockquote className="investor-testimonial-card__quote">
        {testimonial.quote}
      </blockquote>
      <div className="investor-testimonial-card__author">
        <div
          className={`investor-testimonial-card__avatar investor-testimonial-card__avatar--${testimonial.accent}`}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div>
          <div className="investor-testimonial-card__name">
            {testimonial.name}
          </div>
          <div className="investor-testimonial-card__designation">
            {testimonial.designation}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function InvestorTestimonials() {
  return (
    <section
      className="investor-testimonials"
      aria-labelledby="investor-testimonials-title"
    >
      <div className="investor-testimonials__header">
        <div className="investor-testimonials__eyebrow">
          <span aria-hidden="true" />
          Trusted by serious capital
        </div>
        <h2 id="investor-testimonials-title">
          What Investors and Bankers Say
        </h2>
        <p>
          Feedback from merchant bankers, fund managers, and family offices
          already operating on CAPLORE.
        </p>
      </div>

      <div className="investor-testimonials__rows">
        <div className="investor-testimonials__marquee-mask">
          <Marquee speed={50} pauseOnHover autoFill>
            {rows[0].map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </Marquee>
        </div>

        <div className="investor-testimonials__marquee-mask">
          <Marquee speed={70} pauseOnHover autoFill direction="right">
            {rows[1].map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
