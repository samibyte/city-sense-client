import type { LucideIcon } from "lucide-react";
import {
  Camera,
  CheckCircle2,
  MapPin,
  Network,
  Star,
  Wrench,
} from "lucide-react";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  body: string;
  status: string[];
  detail: string;
}

const STEPS: Step[] = [
  {
    icon: Camera,
    step: "01",
    title: "Report the issue",
    body: "Snap photos, pin the exact location with GPS, and submit a complaint or service request in under a minute.",
    status: ["SUBMITTED", "COMPLAINT", "SERVICE_REQUEST"],
    detail: "Photo + precise geolocation attached",
  },
  {
    icon: Network,
    step: "02",
    title: "Triage & dispatch",
    body: "City staff review incoming grievances and route them — often automatically — to the right department and a certified field resolver.",
    status: ["ASSIGNED", "AUTO-ASSIGN"],
    detail: "Routed to the right department",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Field resolution",
    body: "The resolver accepts the work order, sees the exact incident site, and logs the on-site repair with resolution notes.",
    status: ["ACCEPTED", "IN_PROGRESS"],
    detail: "Work order logged on site",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Verify & rate",
    body: "You confirm the fix is complete and rate the work quality, closing the loop with a public record of the outcome.",
    status: ["RESOLVED", "COMPLETED"],
    detail: "1–5 star citizen feedback",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Ambient divider glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 landing-hairline"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title={
              <>
                From report to resolution,{" "}
                <span className="landing-text-gradient">
                  one transparent loop.
                </span>
              </>
            }
            sub="Every request travels the same visible lifecycle — the same statuses the platform actually uses."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 140}>
              <GlassCard
                spotlight
                glow
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
              >
                {/* Step number watermark */}
                <span
                  aria-hidden
                  className="font-display absolute -top-2 right-4 text-[5.5rem] leading-none font-bold text-white/[0.045] transition-colors duration-500 group-hover:text-emerald-300/10"
                >
                  {step.step}
                </span>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/10 text-emerald-300 ring-1 ring-emerald-400/25 transition-transform duration-500 group-hover:scale-110">
                  <step.icon className="size-6" />
                </div>

                <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-landing-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
                  {step.body}
                </p>

                {/* Real platform statuses */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {step.status.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-landing-line bg-black/25 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-emerald-300/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  <div className="landing-hairline h-px w-full opacity-50" />
                  <p className="mt-3.5 flex items-center gap-2 text-xs font-medium text-landing-faint">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {step.detail}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Mobile connector hint */}
        <Reveal delay={250}>
          <div className="mt-10 flex justify-center lg:hidden">
            <span className="landing-hairline h-px w-40 opacity-60" />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-landing-faint">
            <span className="flex items-center gap-2">
              <Star className="size-4 fill-amber-300 text-amber-300" />
              Feedback closes every request
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-emerald-400/80" />
              Every report is geolocated
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400/80" />
              Full status history retained
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
