"use client";

import { ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CitySenseMark, GlassCard } from "./primitives";
import { ResolverApplyModal } from "./resolver-apply-modal";
import { Reveal } from "./reveal";

export function Cta() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <GlassCard className="relative overflow-hidden rounded-2xl border border-border bg-accent/30 px-6 py-14 text-center sm:px-12 lg:py-16">
            <div className="relative">
              <CitySenseMark className="mx-auto size-12" />

              <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Need help from your city?{" "}
                <span className="text-primary">Start here.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Send a request to your city team and stay informed as they work
                on it.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Button
                  render={<Link href="/auth" />}
                  size="lg"
                  className="px-6"
                >
                  <span>Submit a Request</span>
                  <ArrowRight className="size-4" />
                </Button>

                <Button
                  render={<Link href="/service" />}
                  variant="outline"
                  size="lg"
                  className="border-border bg-card px-6 text-foreground hover:bg-background"
                >
                  <span>Browse Services</span>
                </Button>

                <ResolverApplyModal
                  trigger={
                    <Button
                      variant="ghost"
                      size="lg"
                      className="gap-1.5 text-xs font-semibold text-primary"
                    >
                      <Wrench className="size-4" />
                      <span>Apply as Resolver</span>
                    </Button>
                  }
                />
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
