"use client";

import type { LucideIcon } from "lucide-react";
import {
  Camera,
  CircleCheck,
  ClipboardList,
  Droplets,
  History,
  Lightbulb,
  Network,
  Siren,
  Star,
  Timer,
  Truck,
  Wrench,
} from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { StatusBadge } from "@/components/shared";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

/* ---------------------------------------------------------------- */

const PIPELINE = [
  { label: "Reported", status: "SUBMITTED", icon: Siren },
  { label: "Triaged", status: "ASSIGNED", icon: ClipboardList },
  { label: "Dispatched", status: "ACCEPTED", icon: Network },
  { label: "Resolved", status: "RESOLVED", icon: Wrench },
  { label: "Verified", status: "COMPLETED", icon: CircleCheck },
];

type FeedStatus =
  | "SUBMITTED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "COMPLETED";

interface FeedItem {
  icon: LucideIcon;
  text: string;
  status: FeedStatus;
}

const FEED: FeedItem[] = [
  { icon: Droplets, text: "Water leak reported", status: "SUBMITTED" },
  { icon: Camera, text: "Photo evidence attached", status: "SUBMITTED" },
  { icon: Network, text: "Request routed to Public Works", status: "ASSIGNED" },
  { icon: Lightbulb, text: "Broken lighting reported", status: "SUBMITTED" },
  {
    icon: Wrench,
    text: "Resolver accepted the work order",
    status: "ACCEPTED",
  },
  { icon: Truck, text: "Bulk pickup scheduled", status: "IN_PROGRESS" },
  { icon: Timer, text: "SLA deadline confirmed", status: "ASSIGNED" },
  { icon: CircleCheck, text: "Pothole repair completed", status: "RESOLVED" },
  {
    icon: Star,
    text: "Citizen rated the resolution 5 stars",
    status: "COMPLETED",
  },
];

/* ---------------------------------------------------------------- */

function PipelineVisual() {
  return (
    <GlassCard
      tone="deep"
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-landing-faint">
          Request pipeline
        </p>
        <span className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
          <span className="size-1.5 animate-blink rounded-full bg-emerald-400" />
          LIVE
        </span>
      </div>

      <ol className="relative mt-9 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:justify-between sm:gap-0">
        {/* Rail: vertical on mobile, horizontal from sm up. */}
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-5 w-px bg-landing-line-strong sm:top-5 sm:right-10 sm:bottom-auto sm:left-10 sm:h-px sm:w-auto"
        />

        {/* Travelling pulse along the rail (desktop only). */}
        <div
          aria-hidden
          className="absolute top-5 right-10 left-10 hidden -translate-y-1/2 sm:block"
        >
          <span
            className="absolute size-2.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,1)]"
            style={
              {
                animation: "travel-x 5.5s cubic-bezier(0.45,0,0.55,1) infinite",
                "--travel-size": "10px",
              } as CSSProperties
            }
          />
        </div>

        {PIPELINE.map((node, i) => (
          <li
            key={node.label}
            className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center"
          >
            <div className="relative shrink-0">
              <span
                className="absolute -inset-2.5 rounded-2xl bg-emerald-400/25 blur-md animate-[blink_4.5s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.9}s` }}
              />
              <span className="landing-glass-chip relative flex size-10 items-center justify-center rounded-xl text-emerald-300">
                <node.icon className="size-4.5" />
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-landing-ink">
                {node.label}
              </p>
              <p className="mt-0.5 font-mono text-[9px] tracking-wider text-emerald-300/70">
                {node.status}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-9 border-t border-landing-line pt-5 text-xs leading-relaxed text-landing-faint">
        Every transition is written to an immutable status history — citizens
        and departments see the same truth.
      </p>
    </GlassCard>
  );
}

function FeedVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FEED.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassCard
      tone="deep"
      className="flex h-full flex-col rounded-3xl p-7 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-landing-faint">
          Platform pulse
        </p>
        <span className="flex gap-1" aria-hidden>
          <span className="size-1.5 animate-blink rounded-full bg-emerald-400" />
          <span className="size-1.5 animate-blink rounded-full bg-emerald-400 [animation-delay:0.3s]" />
          <span className="size-1.5 animate-blink rounded-full bg-emerald-400 [animation-delay:0.6s]" />
        </span>
      </div>

      <div className="relative mt-8 min-h-44 flex-1">
        {FEED.map((feed, i) => (
          <div
            key={`${feed.text}-${i}`}
            className={
              i === index
                ? "animate-feed-item absolute inset-0"
                : "pointer-events-none absolute inset-0 opacity-0"
            }
            aria-hidden={i !== index}
          >
            <div className="landing-glass flex h-full flex-col justify-center rounded-2xl p-5">
              <div className="flex items-center gap-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-400/10 text-emerald-300 ring-1 ring-emerald-400/25">
                  <feed.icon className="size-5" />
                </span>
                <p className="text-sm leading-snug font-medium text-landing-ink">
                  {feed.text}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge status={feed.status} size="sm" />
                <span className="font-mono text-[10px] text-landing-faint">
                  #{String(2042 + i)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

const TILES = [
  {
    icon: History,
    title: "Status history",
    body: "Every transition is timestamped and retained on the request record.",
  },
  {
    icon: Network,
    title: "Auto-assignment",
    body: "Requests route to the right department and resolver automatically.",
  },
  {
    icon: Timer,
    title: "SLA tracking",
    body: "Deadlines are enforced per request, with delays surfaced early.",
  },
];

/* ---------------------------------------------------------------- */

export function Activity() {
  return (
    <section id="activity" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[160px]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="City activity"
            title={
              <>
                The city,{" "}
                <span className="landing-text-gradient">in motion.</span>
              </>
            }
            sub="Requests flow through a single transparent pipeline — visible to the resident who reported it and the crew resolving it."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-3" delay={0}>
            <PipelineVisual />
          </Reveal>
          <Reveal className="lg:col-span-2" delay={140}>
            <FeedVisual />
          </Reveal>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 110}>
              <GlassCard
                spotlight
                glow
                className="flex h-full items-start gap-4 rounded-3xl p-6"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-landing-line-strong bg-white/5 text-emerald-300">
                  <tile.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-landing-ink">
                    {tile.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-landing-muted">
                    {tile.body}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
