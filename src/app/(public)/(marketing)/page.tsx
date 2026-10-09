"use client";

import {
  Activity,
  AmbientBackground,
  Cta,
  Ecosystem,
  Features,
  Hero,
  HowItWorks,
  IssueMarquee,
  Problem,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="landing-scope dark relative min-h-screen bg-landing-bg font-sans text-landing-ink selection:bg-primary/30 selection:text-primary-foreground">
      <AmbientBackground />
      <main className="relative">
        <Hero />
        <IssueMarquee />
        <Problem />
        <HowItWorks />
        <Features />
        <Ecosystem />
        <Activity />
        <Cta />
      </main>
    </div>
  );
}
