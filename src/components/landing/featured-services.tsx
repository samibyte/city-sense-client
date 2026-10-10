"use client";

import {
  ArrowRight,
  Droplets,
  HardHat,
  Lightbulb,
  Trees,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

interface ServiceCardItem {
  icon: typeof Wrench;
  title: string;
  department: string;
  priceText: string;
  description: string;
}

const SAMPLE_SERVICES: ServiceCardItem[] = [
  {
    icon: Wrench,
    title: "Pothole & Road Hazard Repair",
    department: "Public Works",
    priceText: "Free to report",
    description:
      "Let the Public Works team know about potholes, damaged curbs, and road hazards.",
  },
  {
    icon: Droplets,
    title: "Main Water Pipeline Leakage",
    department: "Water & Sewerage",
    priceText: "Free to report",
    description:
      "Report water leaks, low pressure, or flooding so the city can investigate.",
  },
  {
    icon: Lightbulb,
    title: "Streetlight Outage & Repair",
    department: "Electrical Operations",
    priceText: "Free to report",
    description:
      "Tell the city about streetlights that need repair in your neighborhood.",
  },
  {
    icon: Truck,
    title: "Bulk Construction & Debris Removal",
    department: "Sanitation & Waste",
    priceText: "Paid service · fee shown before you submit",
    description: "Arrange collection for larger items and construction debris.",
  },
  {
    icon: Trees,
    title: "Hazardous Tree Pruning & Clearing",
    department: "Parks & Greenery",
    priceText: "Paid service · fee shown before you submit",
    description:
      "Request help with overgrown or potentially hazardous tree branches.",
  },
  {
    icon: HardHat,
    title: "Municipal Drainage & Site Inspection",
    department: "Urban Planning",
    priceText: "Paid service · fee shown before you submit",
    description: "Arrange an inspection for drainage and sewer connections.",
  },
];

export function FeaturedServices() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Civic Service Catalog"
            title={
              <>
                Two clear tracks for{" "}
                <span className="landing-text-gradient">every city need.</span>
              </>
            }
            sub="Report public issues at no cost or request a city service. Any applicable fee is shown before you submit."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_SERVICES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 90}>
                <GlassCard className="flex h-full flex-col rounded-xl p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-6" />
                    </div>
                    <span className="pt-1 text-sm text-muted-foreground">
                      {item.department}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base sm:text-lg font-semibold tracking-tight text-landing-ink">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-landing-muted">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
                    <span className="text-sm font-medium text-foreground">
                      <span>{item.priceText}</span>
                    </span>

                    <Link
                      href="/service"
                      className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      <span>Details</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Button
              render={<Link href="/service" />}
              size="lg"
              className="px-8"
            >
              <span>Explore Complete Service Catalog & Pricing</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
