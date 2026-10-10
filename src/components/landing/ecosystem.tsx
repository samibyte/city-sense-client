"use client";

import { ArrowRight, Building2, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./primitives";
import { ResolverApplyModal } from "./resolver-apply-modal";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

interface RoleFeature {
  title: string;
  description: string;
}

interface StakeholderRole {
  id: "citizen" | "resolver" | "admin";
  icon: typeof Users;
  title: string;
  tagline: string;
  portalUrl: string;
  portalLabel: string;
  badge: string;
  features: RoleFeature[];
  previewDetails: {
    label: string;
    items: { label: string; value: string }[];
  };
}

const ROLES: StakeholderRole[] = [
  {
    id: "citizen",
    icon: Users,
    title: "Citizen Portal",
    tagline: "A simple place to request help and keep up with city services",
    portalUrl: "/dashboard",
    portalLabel: "Citizen Dashboard",
    badge: "Resident Experience",
    features: [
      {
        title: "A straightforward account",
        description:
          "Create an account to submit requests and keep them together in one place.",
      },
      {
        title: "Report an issue or request a service",
        description:
          "Share what is needed, where it is needed, and add a photo if it helps.",
      },
      {
        title: "Know service costs up front",
        description:
          "If a service has a fee, its price is shown before you submit your request.",
      },
      {
        title: "Follow your request",
        description:
          "See updates from the city team and share feedback when the work is complete.",
      },
    ],
    previewDetails: {
      label: "Citizen Dashboard Features",
      items: [
        {
          label: "Authentication",
          value: "OTP Email Verification + Google Sign-In",
        },
        { label: "Request Kinds", value: "COMPLAINT & SERVICE_REQUEST" },
        {
          label: "Payment Gateway",
          value: "Stripe Checkout + Instant Webhook",
        },
        { label: "Verification", value: "1–5 Star Rating & Citizen Feedback" },
      ],
    },
  },
  {
    id: "resolver",
    icon: Wrench,
    title: "Resolver Portal",
    tagline: "The tools city crews need to coordinate and complete work",
    portalUrl: "/resolver",
    portalLabel: "Resolver Operations",
    badge: "Field Crews & Technicians",
    features: [
      {
        title: "Apply to work with the city",
        description:
          "Share your experience and qualifications for the city to review.",
      },
      {
        title: "Reviewed by city administrators",
        description:
          "Applications are reviewed before access to field assignments is granted.",
      },
      {
        title: "See your assigned work",
        description:
          "Review request details and locations, then let the team know how you can help.",
      },
      {
        title: "Keep requesters informed",
        description:
          "Record progress and completion so residents can follow the work.",
      },
    ],
    previewDetails: {
      label: "Resolver Workflow",
      items: [
        {
          label: "Onboarding",
          value: "Resume & Certificate Vetting (Cloudinary)",
        },
        { label: "Credentials", value: "Auto-Generated Upon Admin Approval" },
        { label: "Actions", value: "Accept / Reject with Reason" },
        {
          label: "Milestones",
          value: "IN_PROGRESS → COMPLETED + Proof Upload",
        },
      ],
    },
  },
  {
    id: "admin",
    icon: Building2,
    title: "City Administration",
    tagline: "One workspace for services, incoming requests, and city teams",
    portalUrl: "/admin",
    portalLabel: "Admin Command Center",
    badge: "City Administration",
    features: [
      {
        title: "A citywide overview",
        description:
          "See incoming work and how requests are moving across departments.",
      },
      {
        title: "Coordinate city responses",
        description:
          "Review requests, assign crews, and keep request information up to date.",
      },
      {
        title: "Manage city services",
        description:
          "Keep departments, service categories, and service details current.",
      },
      {
        title: "Review field team applications",
        description:
          "Manage applications and access for the people delivering city services.",
      },
    ],
    previewDetails: {
      label: "Administrative Governance",
      items: [
        {
          label: "Command Center",
          value: "Citywide Metrics & Resolution KPIs",
        },
        {
          label: "Dispatch Control",
          value: "Manual Assign, Reassign & Status Override",
        },
        {
          label: "Catalog Control",
          value: "Departments, Categories & Paid Services",
        },
        {
          label: "User Governance",
          value: "Resolver Vetting & Status Toggles",
        },
      ],
    },
  },
];

export function Ecosystem() {
  const [activeTab, setActiveTab] = useState<"citizen" | "resolver" | "admin">(
    "citizen",
  );
  const currentRole = ROLES.find((r) => r.id === activeTab) || ROLES[0];

  return (
    <section id="ecosystem" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="For residents and city teams"
            title={
              <>
                One city service,{" "}
                <span className="landing-text-gradient">
                  three ways to help.
                </span>
              </>
            }
            sub="Residents, field crews, and city administrators each have a clear place to get their part of the work done."
          />
        </Reveal>

        {/* Tab Selector */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-border bg-muted p-1">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isActive = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveTab(role.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Role Content Card */}
        <div className="mt-10">
          <Reveal key={currentRole.id}>
            <GlassCard className="rounded-xl p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                {/* Left: Role Info & Features */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                      {currentRole.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {currentRole.tagline}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {currentRole.features.map((feat) => (
                      <div
                        key={feat.title}
                        className="rounded-lg border border-border bg-background p-4 space-y-1.5"
                      >
                        <h4 className="text-xs sm:text-sm font-semibold text-landing-ink flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          {feat.title}
                        </h4>
                        <p className="text-xs text-landing-muted leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-landing-line/60">
                    <Button
                      render={<Link href={currentRole.portalUrl} />}
                      size="sm"
                      className="text-xs font-semibold"
                    >
                      <span>{currentRole.portalLabel}</span>
                      <ArrowRight className="size-3.5" />
                    </Button>

                    {currentRole.id === "resolver" && (
                      <ResolverApplyModal
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Wrench className="size-3.5" />
                            <span>Submit Resolver Application</span>
                          </Button>
                        }
                      />
                    )}

                    {currentRole.id === "citizen" && (
                      <Button
                        render={<Link href="/service" />}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <span>Browse Municipal Catalog</span>
                      </Button>
                    )}
                  </div>
                </div>

                <aside className="rounded-lg bg-muted p-5 text-sm leading-relaxed text-muted-foreground lg:col-span-5">
                  City Sense gives every participant the information they need
                  to move a request forward, without losing sight of the people
                  who asked for help.
                </aside>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
