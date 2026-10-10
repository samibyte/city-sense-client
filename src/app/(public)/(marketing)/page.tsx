"use client";

import {
  AmbientBackground,
  AutoAssignmentSection,
  Cta,
  Ecosystem,
  FaqSection,
  FeaturedServices,
  Hero,
  HowItWorks,
  IssueMarquee,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <AmbientBackground />
      <main className="relative">
        <Hero />
        <IssueMarquee />
        <HowItWorks />
        <AutoAssignmentSection />
        <Ecosystem />
        <FeaturedServices />
        <FaqSection />
        <Cta />
      </main>
    </div>
  );
}
