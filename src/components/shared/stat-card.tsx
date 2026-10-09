import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-border/80 hover:shadow-md hover:bg-card/60",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {title}
        </p>
        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {value}
        </h3>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trend.positive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
