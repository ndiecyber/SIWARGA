import React from "react";
import { Hero } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { RTBoardSection } from "../components/rt-board-section";
import { Highlight } from "../components/highlight-section";
import { TwoViews } from "../components/two-views-section";
import { DataReportsSection } from "../components/data-reports-section";
import FAQSection from "../components/faq-section";
import TestimonialSection from "../components/testimonial-section";
import HowItWorksSection from "../components/how-it-works-section";
import ContactLanding from "../components/contacts";
import { AnnouncementsSection } from "../components/announcements-section";
import { GallerySection } from "../components/gallery-section";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <RTBoardSection />
      <Highlight />
      <HowItWorksSection />
      <TwoViews />
      <DataReportsSection />
      {/* <TestimonialSection /> */}
      <AnnouncementsSection />
      <GallerySection />
      {/* <FAQSection /> */}
      <ContactLanding />
    </div>
  );
};

export default LandingPage;
