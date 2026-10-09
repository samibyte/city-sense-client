import { cn } from "@/lib/utils";
import type { RequestStatus, Priority, AssignmentStatus } from "@/types";

interface StatusBadgeProps {
  status: RequestStatus | AssignmentStatus | string;
  className?: string;
  size?: "sm" | "default";
}

const STATUS_CONFIG: Record<
  string,
  { label: string; dotClass: string; bgClass: string }
> = {
  // Request statuses
  PENDING: {
    label: "Pending",
    dotClass: "bg-amber-500",
    bgClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  SUBMITTED: {
    label: "Submitted",
    dotClass: "bg-blue-500",
    bgClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  ASSIGNED: {
    label: "Assigned",
    dotClass: "bg-indigo-500",
    bgClass:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  ACCEPTED: {
    label: "Accepted",
    dotClass: "bg-sky-500",
    bgClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dotClass: "bg-teal-500 animate-pulse",
    bgClass:
      "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  },
  ON_HOLD: {
    label: "On Hold",
    dotClass: "bg-yellow-500",
    bgClass:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    dotClass: "bg-emerald-500",
    bgClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  COMPLETED: {
    label: "Completed",
    dotClass: "bg-green-500",
    bgClass:
      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    dotClass: "bg-rose-500",
    bgClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    dotClass: "bg-zinc-400",
    bgClass:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  // Assignment statuses
  REASSIGNED: {
    label: "Reassigned",
    dotClass: "bg-purple-500",
    bgClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  // Generic / Users
  ACTIVE: {
    label: "Active",
    dotClass: "bg-emerald-500",
    bgClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  INACTIVE: {
    label: "Inactive",
    dotClass: "bg-zinc-400",
    bgClass:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
  SUSPENDED: {
    label: "Suspended",
    dotClass: "bg-rose-500",
    bgClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  APPROVED: {
    label: "Approved",
    dotClass: "bg-emerald-500",
    bgClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
};

export function StatusBadge({
  status,
  className,
  size = "default",
}: StatusBadgeProps) {
  const normalized = status ? status.toUpperCase() : "PENDING";
  const config = STATUS_CONFIG[normalized] || {
    label: status,
    dotClass: "bg-zinc-400",
    bgClass:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight select-none",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        config.bgClass,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", config.dotClass)} />
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }: { priority?: Priority | null }) {
  if (!priority) return null;
  const colors: Record<Priority, string> = {
    HIGH: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    MEDIUM:
      "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    LOW: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium tracking-tight",
        colors[priority] || "text-muted-foreground border-border/40",
      )}
    >
      {priority}
    </span>
  );
}
