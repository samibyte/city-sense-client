import type { LucideIcon } from "lucide-react";
import { EyeOff, Hourglass, Layers } from "lucide-react";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

const PAINS: {
  icon: LucideIcon;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
}[] = [
  {
    icon: EyeOff,
    title: "Reports vanish into the void",
    body: "Phone calls, paper forms and email threads leave residents guessing whether anyone heard them — or acted.",
    stat: "No status",
    statLabel: "after you submit",
  },
  {
    icon: Layers,
    title: "Departments work in silos",
    body: "Grievances sit in separate queues with no shared view of what is broken, where, and who is fixing it.",
    stat: "No shared",
    statLabel: "operational picture",
  },
  {
    icon: Hourglass,
    title: "Nothing is held accountable",
    body: "Without tracked SLAs and status history, delays go unnoticed and resolutions can never be verified.",
    stat: "No SLA",
    statLabel: "enforcement",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="The problem"
            title={
              <>
                Civic issues shouldn&apos;t{" "}
                <span className="landing-text-gradient">disappear.</span>
              </>
            }
            sub="Every city runs on reports from its residents — but the journey from complaint to fix is usually invisible, fragmented, and unaccountable."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PAINS.map((pain, i) => (
            <Reveal key={pain.title} delay={i * 120}>
              <GlassCard
                spotlight
                glow
                className="group flex h-full flex-col rounded-3xl p-7"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]">
                  <pain.icon className="size-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
                  {pain.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-landing-muted">
                  {pain.body}
                </p>
                <div className="mt-auto pt-6">
                  <div className="landing-hairline h-px w-full opacity-60" />
                  <p className="mt-4 text-sm">
                    <span className="font-display text-lg font-semibold text-landing-faint line-through">
                      {pain.stat}
                    </span>
                    <span className="ml-2 text-xs text-landing-faint">
                      {pain.statLabel}
                    </span>
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="landing-glass mt-6 flex flex-col items-center gap-4 rounded-3xl border-landing-line-strong bg-gradient-to-r from-emerald-500/[0.07] via-transparent to-teal-500/[0.07] px-8 py-6 text-center sm:flex-row sm:justify-center">
            <p className="text-sm text-landing-muted">
              <span className="font-semibold text-landing-ink">
                City Sense closes the loop —
              </span>{" "}
              one transparent request lifecycle, shared by citizens, resolvers
              and administrators.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
