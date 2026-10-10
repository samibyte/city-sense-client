import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeedbackScreenProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function FeedbackScreen({
  eyebrow,
  title,
  description,
  icon,
  action,
  className,
}: FeedbackScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center text-foreground",
        className,
      )}
    >
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-card/60 text-primary shadow-xs backdrop-blur-xs">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {description && (
        <div className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
      )}
      {action && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
