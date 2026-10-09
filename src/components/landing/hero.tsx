"use client";

import {
  ArrowRight,
  Camera,
  MapPin,
  Radar,
  Star,
  Timer,
  UserCheck,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/shared";
import { CityMap } from "./hero-map";
import {
  BrandLinkButton,
  GlassCard,
  GlassLinkButton,
  useParallax,
} from "./primitives";

/* ---------------------------------------------------------------- */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Ticking SLA countdown — mirrors the real `slaDeadline` field. */
function SlaCountdown() {
  const [seconds, setSeconds] = useState(21 * 3600 + 43 * 60 + 12);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[11px] font-medium tabular-nums text-emerald-300">
      {pad(Math.floor(seconds / 3600))}:{pad(Math.floor((seconds % 3600) / 60))}
      :{pad(seconds % 60)}
    </span>
  );
}

/* ---------------------------------------------------------------- */

interface FloatingChipProps {
  className?: string;
  pf: number;
  floatDelay?: string;
  children: ReactNode;
}

function FloatingChip({
  className,
  pf,
  floatDelay,
  children,
}: FloatingChipProps) {
  return (
    <div
      className={`landing-parallax absolute z-20 ${className ?? ""}`}
      style={{ "--pf": pf } as CSSProperties}
    >
      <div
        className="landing-glass-chip flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] animate-float"
        style={{ animationDelay: floatDelay ?? "0s" }}
      >
        {children}
      </div>
    </div>
  );
}

const TRUST_SIGNALS = [
  { icon: Camera, label: "Photo-verified reports" },
  { icon: Radar, label: "Real-time tracking" },
  { icon: Timer, label: "SLA-backed resolution" },
];

const LEGEND = [
  { dot: "bg-emerald-400", label: "Open request" },
  { dot: "bg-teal-400", label: "In progress" },
  { dot: "bg-emerald-200", label: "Resolver unit" },
];

/* ---------------------------------------------------------------- */

export function Hero() {
  const { ref, onPointerMove } = useParallax<HTMLElement>();

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24"
    >
      {/* Section-local glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 size-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        {/* Copy */}
        <div className="lg:col-span-5">
          <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-landing-line bg-white/5 px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-landing-muted">
              Municipal operations, reimagined
            </span>
          </div>

          <h1
            className="animate-fade-up mt-6 font-display text-[2.65rem] leading-[1.06] font-bold tracking-tight text-landing-ink text-balance sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            Smarter municipal services,{" "}
            <span className="landing-text-gradient">
              responsive resolutions.
            </span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-lg text-base leading-relaxed text-landing-muted sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            City Sense connects citizens directly with city departments and
            field resolvers. Report civic issues, request official services, and
            track resolutions with complete transparency.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-3.5"
            style={{ animationDelay: "270ms" }}
          >
            <BrandLinkButton href="/auth">
              <span>Submit a Request</span>
              <ArrowRight className="size-4" />
            </BrandLinkButton>
            <GlassLinkButton href="#how-it-works">
              <Radar className="size-4" />
              <span>See how it works</span>
            </GlassLinkButton>
          </div>

          <ul
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3"
            style={{ animationDelay: "360ms" }}
          >
            {TRUST_SIGNALS.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-[13px] font-medium text-landing-faint"
              >
                <item.icon className="size-4 text-emerald-400/80" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* City operations console */}
        <div className="relative lg:col-span-7">
          <div
            className="animate-fade-up landing-parallax relative"
            style={{ animationDelay: "300ms", "--pf": 0.35 } as CSSProperties}
          >
            <GlassCard
              tone="deep"
              spotlight
              className="overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.75)]"
            >
              {/* Console header */}
              <div className="flex items-center justify-between border-b border-landing-line px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-2.5 rounded-full bg-rose-400/70" />
                    <span className="size-2.5 rounded-full bg-amber-400/70" />
                    <span className="size-2.5 rounded-full bg-emerald-400/70" />
                  </span>
                  <span className="text-[13px] font-medium text-landing-muted">
                    Operations Grid
                  </span>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
                  <span className="size-1.5 animate-blink rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>

              {/* Map + overlays */}
              <div className="relative">
                <CityMap />

                {/* Radar sweep over the active pin */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-[36.5%] left-[34.7%] -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="animate-radar relative size-36 rounded-full bg-[conic-gradient(from_0deg,rgba(52,211,153,0.32),transparent_70deg)]" />
                  <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
                  <div className="absolute inset-4 rounded-full border border-emerald-400/12" />
                </div>

                {/* Live request card */}
                <GlassCard
                  tone="deep"
                  className="absolute top-4 right-4 w-56 rounded-2xl p-4 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.7)] sm:w-60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-landing-faint">
                      CS-2041
                    </span>
                    <StatusBadge status="IN_PROGRESS" size="sm" />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-snug font-semibold text-landing-ink">
                    Water leak on Main Avenue
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-landing-faint">
                    <MapPin className="size-3 text-emerald-400/80" />
                    Main Avenue · Downtown
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-landing-line bg-black/25 px-2.5 py-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-landing-faint">
                      <Timer className="size-3" />
                      SLA due
                    </span>
                    <SlaCountdown />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    {["bg-emerald-400", "bg-emerald-400", "bg-emerald-400"].map(
                      (seg, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative segments
                          key={i}
                          className={`h-1 flex-1 rounded-full ${seg}`}
                        />
                      ),
                    )}
                    <span className="h-1 flex-1 rounded-full bg-white/15" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <PriorityBadge priority="HIGH" />
                    <span className="text-[10px] text-landing-faint">
                      3 of 4 stages
                    </span>
                  </div>
                </GlassCard>

                {/* Legend */}
                <GlassCard
                  tone="chip"
                  className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl px-3.5 py-2"
                >
                  {LEGEND.map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-1.5 text-[10px] font-medium text-landing-muted"
                    >
                      <span className={`size-1.5 rounded-full ${item.dot}`} />
                      {item.label}
                    </span>
                  ))}
                </GlassCard>
              </div>
            </GlassCard>
          </div>

          {/* Floating evidence chips */}
          <FloatingChip
            className="-top-5 -left-3 sm:-left-8"
            pf={0.55}
            floatDelay="0.4s"
          >
            <Camera className="size-4 text-emerald-300" />
            <span className="text-xs font-medium text-landing-ink">
              Photo evidence attached
            </span>
          </FloatingChip>
          <FloatingChip
            className="top-1/3 -left-6 hidden sm:block"
            pf={0.75}
            floatDelay="1.6s"
          >
            <UserCheck className="size-4 text-teal-300" />
            <span className="text-xs font-medium text-landing-ink">
              Resolver assigned
            </span>
          </FloatingChip>
          <FloatingChip
            className="-bottom-6 right-2 sm:-right-4"
            pf={0.5}
            floatDelay="2.4s"
          >
            <Star className="size-4 fill-amber-300 text-amber-300" />
            <span className="text-xs font-medium text-landing-ink">
              Rated 5.0 by citizen
            </span>
          </FloatingChip>
        </div>
      </div>
    </section>
  );
}
