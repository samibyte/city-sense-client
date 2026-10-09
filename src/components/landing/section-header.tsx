import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-landing-brand">
        <span className="landing-hairline h-px w-6" aria-hidden />
        {eyebrow}
        {align === "center" && (
          <span className="landing-hairline h-px w-6" aria-hidden />
        )}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-landing-ink text-balance sm:text-4xl sm:leading-[1.15]">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-base leading-relaxed text-landing-muted">
          {sub}
        </p>
      )}
    </div>
  );
}
