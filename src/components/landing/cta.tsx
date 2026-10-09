import { ArrowRight, MapPin, Radar, Star } from "lucide-react";
import {
  BrandLinkButton,
  CitySenseMark,
  GlassCard,
  GlassLinkButton,
} from "./primitives";
import { Reveal } from "./reveal";

export function Cta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <GlassCard
            tone="deep"
            spotlight
            className="relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 lg:py-20"
          >
            {/* Interior glows */}
            <div
              aria-hidden
              className="absolute -top-32 left-1/4 size-96 rounded-full bg-primary/20 blur-[110px]"
            />
            <div
              aria-hidden
              className="absolute -right-24 -bottom-32 size-96 rounded-full bg-secondary/16 blur-[110px]"
            />
            {/* Horizon grid */}
            <div
              aria-hidden
              className="landing-grid absolute inset-x-0 bottom-0 h-40 [mask-image:linear-gradient(to_top,black,transparent)] opacity-60"
            />

            <div className="relative">
              <CitySenseMark className="mx-auto size-14 drop-shadow-[0_10px_30px_rgba(52,211,153,0.45)]" />
              <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-landing-ink text-balance sm:text-5xl">
                Your city is already talking.{" "}
                <span className="landing-text-gradient">Start fixing it.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-landing-muted sm:text-lg">
                Report issues, request municipal services, and track every
                resolution — transparently, from first photo to final sign-off.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                <BrandLinkButton href="/auth">
                  <span>Submit a Request</span>
                  <ArrowRight className="size-4" />
                </BrandLinkButton>
                <GlassLinkButton href="/auth">
                  <span>Portal Sign In</span>
                </GlassLinkButton>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-landing-faint">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-emerald-400/80" />
                  GPS-verified reports
                </li>
                <li className="flex items-center gap-2">
                  <Radar className="size-4 text-emerald-400/80" />
                  Live status tracking
                </li>
                <li className="flex items-center gap-2">
                  <Star className="size-4 text-amber-300/80" />
                  Citizen-rated resolutions
                </li>
              </ul>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
