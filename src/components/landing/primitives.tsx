"use client";

import Link from "next/link";
import { type PointerEvent, type ReactNode, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Glass surfaces                                                             */
/* -------------------------------------------------------------------------- */

export type GlassTone = "surface" | "deep" | "chip";

const GLASS_TONE: Record<GlassTone, string> = {
  surface: "landing-glass",
  deep: "landing-glass-deep",
  chip: "landing-glass-chip",
};

interface GlassCardProps {
  children: ReactNode;
  tone?: GlassTone;
  /** Track the pointer to render a soft brand spotlight. */
  spotlight?: boolean;
  /** Lift and outline the card on hover. */
  glow?: boolean;
  className?: string;
}

/**
 * A translucent, blurred panel. Optionally tracks the pointer so the
 * `.landing-spotlight` radial highlight follows the cursor.
 */
export function GlassCard({
  children,
  tone = "surface",
  spotlight = false,
  glow = false,
  className,
}: GlassCardProps) {
  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!spotlight) return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        "--mx",
        `${event.clientX - rect.left}px`,
      );
      event.currentTarget.style.setProperty(
        "--my",
        `${event.clientY - rect.top}px`,
      );
    },
    [spotlight],
  );

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        GLASS_TONE[tone],
        spotlight && "landing-spotlight",
        glow && "landing-border-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

interface BrandLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** Solid brand call to action. */
export function BrandLinkButton({
  href,
  children,
  className,
}: BrandLinkButtonProps) {
  return (
    <Button
      render={<Link href={href} />}
      size="lg"
      className={cn(
        "h-12 gap-2 px-6 text-[15px] font-semibold shadow-[0_14px_36px_-10px_rgba(52,211,153,0.6)] transition-shadow hover:shadow-[0_18px_44px_-10px_rgba(52,211,153,0.75)]",
        className,
      )}
    >
      {children}
    </Button>
  );
}

/** Secondary action rendered as a translucent glass chip. */
export function GlassLinkButton({
  href,
  children,
  className,
}: BrandLinkButtonProps) {
  return (
    <Button
      render={<Link href={href} />}
      variant="outline"
      size="lg"
      className={cn(
        "landing-glass-chip h-12 border-landing-line-strong bg-white/5 px-6 text-[15px] text-landing-ink backdrop-blur-xl hover:bg-white/10 hover:text-landing-ink",
        className,
      )}
    >
      {children}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Attaches a pointer handler that exposes normalized offsets as `--px`/`--py`
 * on the referenced element. Children opt in with the `.landing-parallax`
 * class and a `--pf` strength. Pointer parallax is skipped for users who
 * prefer reduced motion.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      "--px",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 18}px`,
    );
    el.style.setProperty(
      "--py",
      `${((event.clientY - rect.top) / rect.height - 0.5) * 18}px`,
    );
  }, []);

  return { ref, onPointerMove };
}
