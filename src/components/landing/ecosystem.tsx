"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

/* ---------------------------------------------------------------- */

interface Role {
  id: string;
  icon: LucideIcon;
  label: string;
  headline: string;
  description: string;
  capabilities: string[];
  portal: string;
  portalLabel: string;
}

const ROLES: Role[] = [
  {
    id: "citizen",
    icon: Users,
    label: "Citizen",
    headline: "Report it in under a minute",
    description:
      "Log potholes, broken lighting, water leaks, or schedule bulk pickups with photo evidence — and watch every step until it is fixed.",
    capabilities: [
      "Photo + GPS-verified reports",
      "Real-time progress updates",
      "Service catalog & paid requests",
      "Confirm completion & rate resolvers",
    ],
    portal: "/dashboard",
    portalLabel: "Citizen portal",
  },
  {
    id: "resolver",
    icon: Wrench,
    label: "Resolver",
    headline: "Get dispatched, do the work",
    description:
      "Receive dispatched work orders directly on mobile or web. Accept tasks, view exact incident locations, and log on-site repairs with resolution notes.",
    capabilities: [
      "Dispatched work orders",
      "Exact incident locations",
      "Accept, reject or reassignment flow",
      "Resolution notes & completion logging",
    ],
    portal: "/resolver/assignments",
    portalLabel: "Resolver portal",
  },
  {
    id: "admin",
    icon: Building2,
    label: "Administrator",
    headline: "Run the whole operation",
    description:
      "Triage incoming grievances, manage service catalogs, monitor departmental turnaround SLAs, and dispatch certified field resolvers to problem areas.",
    capabilities: [
      "Grievance triage & assignment",
      "Service & category management",
      "Departmental SLA monitoring",
      "Certified resolver dispatch",
    ],
    portal: "/admin/requests",
    portalLabel: "Admin portal",
  },
];

/* ---------------------------------------------------------------- */

function CitizenVisual() {
  return (
    <GlassCard tone="deep" className="space-y-4 rounded-2xl p-5">
      <div className="relative h-32 overflow-hidden rounded-xl border border-landing-line">
        <div className="landing-grid absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 to-teal-500/8" />
        <Camera className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-emerald-300/70" />
        <span className="absolute top-2.5 right-2.5 rounded-md border border-emerald-400/25 bg-black/40 px-2 py-0.5 font-mono text-[9px] text-emerald-300">
          IMG_0412.jpg
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-[13px] font-semibold text-landing-ink">
          Pothole on Main Avenue
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-landing-faint">
          <MapPin className="size-3 text-emerald-400/80" />
          Main Avenue · Downtown
        </p>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status="SUBMITTED" size="sm" />
        <span className="flex items-center gap-1 text-[10px] text-landing-faint">
          <Clock className="size-3" />2 min ago
        </span>
      </div>
    </GlassCard>
  );
}

function ResolverVisual() {
  return (
    <GlassCard tone="deep" className="space-y-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium text-landing-faint">
          WO-1187
        </span>
        <StatusBadge status="ACCEPTED" size="sm" />
      </div>
      <div className="space-y-2">
        <p className="text-[13px] font-semibold text-landing-ink">
          Water leak — 4th Street junction
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-landing-faint">
          <MapPin className="size-3 text-teal-400/80" />
          4th Street · Riverside
        </p>
      </div>
      <div className="flex items-center justify-between">
        <PriorityBadge priority="HIGH" />
        <span className="flex items-center gap-1.5 rounded-lg border border-landing-line bg-black/25 px-2.5 py-1 text-[10px] font-medium text-landing-muted">
          <CheckCircle2 className="size-3 text-emerald-400" />
          Arrived on site
        </span>
      </div>
    </GlassCard>
  );
}

function AdminVisual() {
  const rows = [
    {
      id: "CS-2041",
      title: "Water leak on Main Avenue",
      status: "IN_PROGRESS",
      priority: "HIGH" as const,
    },
    {
      id: "CS-2040",
      title: "Broken streetlight, Block C",
      status: "ASSIGNED",
      priority: "MEDIUM" as const,
    },
    {
      id: "CS-2039",
      title: "Bulk pickup request",
      status: "PENDING",
      priority: "LOW" as const,
    },
  ];
  return (
    <GlassCard tone="deep" className="space-y-2.5 rounded-2xl p-5">
      <p className="px-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-landing-faint">
        Triage queue
      </p>
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-landing-line bg-black/25 px-3.5 py-2.5"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-landing-ink">
              {row.title}
            </p>
            <p className="font-mono text-[9px] text-landing-faint">{row.id}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={row.priority} />
            <StatusBadge status={row.status} size="sm" />
          </div>
        </div>
      ))}
    </GlassCard>
  );
}

const VISUALS = {
  citizen: CitizenVisual,
  resolver: ResolverVisual,
  admin: AdminVisual,
} as const;

/* ---------------------------------------------------------------- */

const TAB_ID = "ecosystem-role";

export function Ecosystem() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const role = ROLES[active];
  const Visual = VISUALS[role.id as keyof typeof VISUALS];

  const moveFocus = (event: React.KeyboardEvent, index: number) => {
    const last = ROLES.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="ecosystem" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute top-1/4 -left-44 size-[30rem] rounded-full bg-primary/8 blur-[140px]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="The ecosystem"
            title={
              <>
                One loop,{" "}
                <span className="landing-text-gradient">three roles.</span>
              </>
            }
            sub="A single operational loop uniting residents, dispatch controllers, and field crews."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-14">
            {/* Tab bar */}
            <div
              role="tablist"
              aria-label="Platform roles"
              className="landing-glass mx-auto flex max-w-md rounded-2xl p-1.5"
            >
              {ROLES.map((r, i) => (
                <button
                  key={r.id}
                  id={`${TAB_ID}-${r.id}`}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={`${TAB_ID}-panel-${r.id}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => moveFocus(event, i)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-300",
                    active === i
                      ? "text-landing-on-brand"
                      : "text-landing-muted hover:text-landing-ink",
                  )}
                >
                  {active === i && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 shadow-[0_8px_24px_-8px_rgba(52,211,153,0.7)]" />
                  )}
                  <r.icon className="relative size-4" />
                  <span className="relative">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div
              role="tabpanel"
              key={role.id}
              id={`${TAB_ID}-panel-${role.id}`}
              aria-labelledby={`${TAB_ID}-${role.id}`}
              className="animate-fade-up mt-8 grid items-center gap-10 outline-none lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/10 text-emerald-300 ring-1 ring-emerald-400/25">
                    <role.icon className="size-5.5" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-landing-ink">
                    {role.headline}
                  </h3>
                </div>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-landing-muted">
                  {role.description}
                </p>
                <ul className="mt-7 space-y-3.5">
                  {role.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-3 text-sm text-landing-muted"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30">
                        <CheckCircle2 className="size-3 text-emerald-300" />
                      </span>
                      {cap}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    render={<Link href={role.portal} />}
                    size="lg"
                    className="h-11 gap-2 px-5 text-sm font-semibold shadow-[0_10px_28px_-10px_rgba(52,211,153,0.55)]"
                  >
                    <span>{role.portalLabel}</span>
                    <ArrowRight className="size-4" />
                  </Button>
                  {role.id === "citizen" && (
                    <Button
                      render={<Link href="/dashboard/requests/new" />}
                      variant="outline"
                      size="lg"
                      className="landing-glass-chip h-11 border-landing-line-strong bg-white/5 px-5 text-sm text-landing-ink hover:bg-white/10"
                    >
                      <ShieldCheck className="size-4" />
                      <span>New request</span>
                    </Button>
                  )}
                  {role.id === "resolver" && (
                    <span className="flex items-center gap-2 text-xs text-landing-faint">
                      <Star className="size-3.5 text-amber-300/80" />
                      Certified field network
                    </span>
                  )}
                </div>
              </div>

              <Visual />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
