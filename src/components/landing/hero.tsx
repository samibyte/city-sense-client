"use client";

import { ArrowRight, Check, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResolverApplyModal } from "./resolver-apply-modal";

const STEPS = [
  { label: "Your report is received", complete: true },
  { label: "The right city team is assigned", complete: true },
  { label: "You can follow progress to resolution", complete: false },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            City services, made easier
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            A better way to get things done in your city.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Report an issue, find a municipal service, and stay informed as your
            city team works on it. One clear place to get help and follow
            through.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button render={<Link href="/auth" />} size="lg">
              Submit a request
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/service" />}
              variant="outline"
              size="lg"
            >
              Browse city services
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Check className="size-4 text-primary" />
              Track updates in one place
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="size-4 text-primary" />
              Connect directly with city teams
            </span>
          </div>

          <ResolverApplyModal
            trigger={
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              >
                <Wrench className="size-4" />
                Work with your city as a resolver
              </button>
            }
          />
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
            <div className="flex items-start gap-4 border-b border-border pb-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  A city request
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Streetlight repair
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reported near your neighborhood
                </p>
              </div>
            </div>

            <ol className="mt-6 space-y-5">
              {STEPS.map((step, index) => (
                <li key={step.label} className="flex gap-4">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      step.complete
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {step.complete ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <span
                    className={`pt-1 text-sm ${
                      step.complete
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              From the first report to the final update, the next step is easy
              to see.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
