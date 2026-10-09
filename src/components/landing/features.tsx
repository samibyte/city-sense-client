"use client";

import {
  Camera,
  CreditCard,
  Gauge,
  MapPin,
  Radar,
  Star,
  Timer,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

/* ---------------------------------------------------------------- */

function SpotlightCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <GlassCard
        spotlight
        glow
        className="group flex h-full flex-col rounded-3xl p-7"
      >
        {children}
      </GlassCard>
    </Reveal>
  );
}

function CardIcon({
  icon: Icon,
  tone = "emerald",
}: {
  icon: typeof Radar;
  tone?: "emerald" | "teal" | "amber";
}) {
  const tones = {
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    teal: "border-teal-400/25 bg-teal-400/10 text-teal-300",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  } as const;
  return (
    <div
      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${tones[tone]}`}
    >
      <Icon className="size-6" />
    </div>
  );
}

/* ---------------------------------------------------------------- */

/** Animated lifecycle stepper for the tracking card. */
function TrackingVisual() {
  const nodes = ["SUBMITTED", "ASSIGNED", "IN PROGRESS", "RESOLVED"];
  return (
    <div className="mt-7">
      <div className="relative flex items-center justify-between">
        <div className="absolute right-4 left-4 top-1/2 h-px -translate-y-1/2 bg-landing-line-strong" />
        <div
          aria-hidden
          className="absolute right-4 left-4 top-1/2 -translate-y-1/2"
        >
          <span
            className="absolute size-1.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,1)]"
            style={
              {
                animation: "travel-x 4.5s cubic-bezier(0.45,0,0.55,1) infinite",
                "--travel-size": "6px",
              } as CSSProperties
            }
          />
        </div>
        {nodes.map((node, i) => (
          <div key={node} className="relative flex flex-col items-center gap-2">
            <span
              className={`flex size-4 items-center justify-center rounded-full border-2 ${
                i < 3
                  ? "border-emerald-400 bg-emerald-400/30"
                  : "border-landing-line-strong bg-landing-bg"
              }`}
            >
              {i < 3 && <span className="size-1 rounded-full bg-emerald-200" />}
            </span>
            <span className="font-mono text-[9px] font-medium tracking-wider text-landing-faint">
              {node}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-xl border border-landing-line bg-black/25 px-3.5 py-2.5 font-mono text-[11px] text-landing-muted">
        <span className="text-emerald-300">CS-2041</span> updated{" "}
        <span className="text-landing-faint">just now</span> — status →{" "}
        <span className="text-emerald-300">IN_PROGRESS</span>
      </p>
    </div>
  );
}

/** SLA gauge ring. */
function SlaVisual() {
  return (
    <div className="mt-7 flex items-center gap-5">
      <div className="relative size-24 shrink-0">
        <svg
          viewBox="0 0 96 96"
          className="size-full -rotate-90"
          role="img"
          aria-label="SLA progress gauge showing the request on track"
        >
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="rgba(210,235,224,0.1)"
            strokeWidth="7"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="url(#slaGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset="70"
          />
          <defs>
            <linearGradient id="slaGrad" x1="0" y1="0" x2="96" y2="96">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Timer className="size-4 text-emerald-300" />
          <span className="mt-0.5 font-mono text-[10px] font-semibold text-landing-ink">
            ON TRACK
          </span>
        </div>
      </div>
      <div className="space-y-2.5 text-xs text-landing-muted">
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Deadline set per request
        </p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-teal-400" />
          Delay tracking built in
        </p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Department turnaround visible
        </p>
      </div>
    </div>
  );
}

/** Mini map for the geolocation card. */
function GeoVisual() {
  return (
    <div className="landing-grid relative mt-7 h-28 overflow-hidden rounded-2xl border border-landing-line bg-black/25">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute -inset-4 animate-pulse-ring rounded-full border-2 border-emerald-400/70" />
        <span className="absolute -inset-4 animate-pulse-ring rounded-full border-2 border-emerald-400/70 [animation-delay:1.3s]" />
        <MapPin className="relative size-7 fill-emerald-400 text-emerald-900 drop-shadow-[0_4px_10px_rgba(52,211,153,0.6)]" />
      </div>
      <span className="absolute bottom-2.5 left-3 rounded-md border border-landing-line bg-black/40 px-2 py-0.5 font-mono text-[9px] text-landing-faint">
        23.8103° N · 90.4125° E
      </span>
    </div>
  );
}

/** Photo evidence thumbnail. */
function PhotoVisual() {
  return (
    <div className="relative mt-7 overflow-hidden rounded-2xl border border-landing-line">
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-emerald-500/15 via-[#0a1512] to-teal-500/15">
        <Camera className="size-8 text-emerald-300/70" />
      </div>
      <div className="flex items-center justify-between border-t border-landing-line bg-black/30 px-3 py-2">
        <span className="font-mono text-[10px] text-landing-faint">
          pothole_0412.jpg
        </span>
        <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300">
          VERIFIED
        </span>
      </div>
    </div>
  );
}

/** Payment type badges — mirrors FREE / PAID service types. */
function PaymentVisual() {
  return (
    <div className="mt-7 space-y-2.5">
      <div className="flex items-center justify-between rounded-xl border border-landing-line bg-black/25 px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-xs text-landing-muted">
          <CreditCard className="size-3.5 text-emerald-300" />
          Stripe checkout
        </span>
        <span className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-300">
          PAID
        </span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-landing-line bg-black/25 px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-xs text-landing-muted">
          <Gauge className="size-3.5 text-teal-300" />
          Municipal service
        </span>
        <span className="rounded-md border border-landing-line bg-white/5 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-landing-faint">
          FREE
        </span>
      </div>
    </div>
  );
}

/** Interactive star rating demo — pure CSS, honors reduced motion. */
function FeedbackVisual() {
  return (
    <div className="mt-7">
      <fieldset className="landing-stars border-none p-0">
        <legend className="sr-only">Interactive rating preview</legend>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="landing-star"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star className="size-6" />
          </button>
        ))}
      </fieldset>
      <p className="mt-3 text-xs leading-relaxed text-landing-faint">
        Citizens rate every completed request — feedback is stored with the
        resolution.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute top-1/3 -right-40 size-[28rem] rounded-full bg-secondary/8 blur-[140px]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Core features"
            title={
              <>
                Everything a city needs,{" "}
                <span className="landing-text-gradient">
                  nothing it doesn&apos;t.
                </span>
              </>
            }
            sub="Purpose-built primitives — geolocation, evidence, deadlines, payments and feedback — wired into one request lifecycle."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <SpotlightCard className="lg:col-span-2" delay={0}>
            <CardIcon icon={Radar} />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              Live status tracking
            </h3>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-landing-muted">
              Watch every request move through its real lifecycle — submitted,
              assigned, in progress, resolved — with a status history retained
              on the record.
            </p>
            <TrackingVisual />
          </SpotlightCard>

          <SpotlightCard delay={100}>
            <CardIcon icon={MapPin} tone="teal" />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              Pinpoint geolocation
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
              Accurate street, area and coordinates mean the right crew reaches
              the right spot — fast.
            </p>
            <GeoVisual />
          </SpotlightCard>

          <SpotlightCard delay={150}>
            <CardIcon icon={Timer} tone="amber" />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              SLA accountability
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
              Resolution targets are enforced and delays surface before they
              become grievances.
            </p>
            <SlaVisual />
          </SpotlightCard>

          <SpotlightCard delay={200}>
            <CardIcon icon={Camera} />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              Photo evidence
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
              Attach photos to any report so dispatchers see the problem before
              a resolver rolls out.
            </p>
            <PhotoVisual />
          </SpotlightCard>

          <SpotlightCard delay={250}>
            <CardIcon icon={CreditCard} tone="teal" />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              Integrated Stripe checkout
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
              Fee-based services are paid securely at submission — the price is
              shown up front.
            </p>
            <PaymentVisual />
          </SpotlightCard>

          <SpotlightCard delay={300}>
            <CardIcon icon={Star} tone="amber" />
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-landing-ink">
              Citizen feedback
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-landing-muted">
              Residents review and rate work quality before a request closes.
            </p>
            <FeedbackVisual />
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
