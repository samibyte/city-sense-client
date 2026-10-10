"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

interface Step {
  step: string;
  phase: string;
  title: string;
  description: string;
  highlights: string[];
}

const LIFECYCLE_STEPS: Step[] = [
  {
    step: "01",
    phase: "Start with a request",
    title: "Tell us what you need",
    description:
      "Choose a service or report a public issue. Add a location and any details that will help the city team understand the work.",
    highlights: [
      "Clear request details",
      "Location and optional photos",
      "Service costs shown up front",
    ],
  },
  {
    step: "02",
    phase: "City team review",
    title: "The right people take a look",
    description:
      "Your request is directed to the appropriate municipal department, where staff can review it and coordinate the next steps.",
    highlights: [
      "Sent to the relevant department",
      "Reviewed by city staff",
      "Assigned to an available crew",
    ],
  },
  {
    step: "03",
    phase: "Work gets underway",
    title: "A field team handles the work",
    description:
      "Field crews receive the information they need, carry out the work, and record progress along the way.",
    highlights: [
      "Useful location and issue details",
      "Progress updates as work continues",
      "Completion recorded by the team",
    ],
  },
  {
    step: "04",
    phase: "Stay informed",
    title: "Follow progress through to the finish",
    description:
      "Check your request at any time and see the latest update from the people working on it.",
    highlights: [
      "Updates in your account",
      "A clear request history",
      "Share feedback when it is done",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Subtle top divider line */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 landing-hairline"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="What to expect"
            title={
              <>
                From the first report{" "}
                <span className="landing-text-gradient">
                  to a city response.
                </span>
              </>
            }
            sub="A straightforward way to reach the right city team and see what happens next."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {LIFECYCLE_STEPS.map((item, index) => (
            <Reveal key={item.step} delay={index * 120}>
              <GlassCard
                spotlight
                glow
                className="group relative flex h-full flex-col rounded-3xl p-6 sm:p-7 border-landing-line"
              >
                {/* Large watermark number */}
                <span
                  aria-hidden
                  className="font-display absolute top-2 right-4 text-6xl font-bold text-primary/5"
                >
                  {item.step}
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    {item.phase}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-landing-ink leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-landing-muted">
                  {item.description}
                </p>

                <div className="mt-auto pt-6 border-t border-landing-line/60">
                  <p className="mb-2 text-xs font-semibold text-foreground">
                    What this means for you
                  </p>
                  <ul className="space-y-1.5 text-xs text-landing-muted">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                        <span className="text-[11px]">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Informational callout bar */}
        <Reveal delay={200}>
          <div className="mt-12 rounded-xl border border-border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-landing-ink">
                  Clear updates at every step
                </h4>
                <p className="text-xs text-landing-muted">
                  Request history helps you see what has happened and what comes
                  next.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
