import React from "react";
import { Hero } from "../components/hero-section";
import { Highlight } from "../components/highlight-section";
import { AboutSection } from "../components/about-section";
import FeaturedServices from "../components/featured-services";
import CTASection from "../components/cta-section";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <Highlight />
      <AboutSection />
      <FeaturedServices />
      <CTASection />
    </div>
  );
};

export default LandingPage;
