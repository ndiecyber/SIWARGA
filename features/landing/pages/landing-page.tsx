import React from "react";
import { Hero } from "../components/hero-section";
import { StatsBar } from "../components/statsbar-section";
import { Highlight } from "../components/highlight-section";
import { TwoViews } from "../components/two-views-section";
import FAQSection from "../components/faq-section";
import TestimonialSection from "../components/testimonial-section";
import HowItWorksSection from "../components/how-it-works-section";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <StatsBar />
      <Highlight />
      <HowItWorksSection />
      <TwoViews />
      <FAQSection />
      <TestimonialSection />
    </div>
  );
};

export default LandingPage;
