"use client";

import Link from "next/link";
import {
  useGetMe,
  useGetMyAssignments,
  useAcceptAssignment,
  useRejectAssignment,
} from "@/hooks";
import { StatCard, StatusBadge, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check,
  X,
} from "lucide-react";

export default function ResolverDashboardPage() {
  const { data: meData } = useGetMe();
  const { data: assignData, isLoading } = useGetMyAssignments({ limit: 10 });
  const { mutate: accept } = useAcceptAssignment();
  const { mutate: reject } = useRejectAssignment();

  const user = meData?.data;
  const assignments = (assignData?.data as any) || [];

  const total = assignments.length;
  const pendingCount = assignments.filter(
    (a: any) => a.status === "PENDING",
  ).length;
  const inProgressCount = assignments.filter(
    (a: any) => a.status === "IN_PROGRESS" || a.status === "ACCEPTED",
  ).length;
  const completedCount = assignments.filter(
    (a: any) => a.status === "COMPLETED",
  ).length;

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    accept(id);
  };

  const handleReject = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const reason = prompt("Enter reason for rejecting this assignment:");
    if (reason) {
      reject({ id, reason });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8 backdrop-blur-md shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              <span>Resolver Dispatch</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "Resolver"}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Review assigned field work orders, accept incident tasks, and log
              resolution status directly to headquarters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              render={<Link href="/resolver/assignments" />}
              className="gap-2 shadow-xs"
            >
              <CheckSquare className="size-4" />
              <span>View All Assignments</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned"
          value={total}
          subtitle="All dispatch orders"
          icon={<CheckSquare className="size-5" />}
        />
        <StatCard
          title="Pending Acceptance"
          value={pendingCount}
          subtitle="Awaiting response"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          title="Active / On-Site"
          value={inProgressCount}
          subtitle="Under current repair"
          icon={<AlertCircle className="size-5" />}
        />
        <StatCard
          title="Resolved"
          value={completedCount}
          subtitle="Completed work orders"
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      {/* Recent Assignments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Recent Field Assignments
            </h2>
            <p className="text-xs text-muted-foreground">
              Work orders currently routed to your department queue
            </p>
          </div>
          <Link
            href="/resolver/assignments"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View all assignments</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border/40 p-8 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState
            title="No assignments assigned"
            description="You have no pending or active field assignments currently."
          />
        ) : (
          <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
            {assignments.slice(0, 5).map((item: any) => {
              const req = item.request || {};
              const isPending = item.status === "PENDING";

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-medium text-muted-foreground">
                        #{req.requestNumber || item.requestId?.slice(0, 8)}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                      {item.priority && (
                        <span className="text-[11px] text-muted-foreground">
                          • Priority: {item.priority}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/resolver/assignments/${item.id}`}
                      className="block group"
                    >
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {req.title || "Civic Incident Assignment"}
                      </h4>
                    </Link>

                    <p className="text-xs text-muted-foreground truncate max-w-xl">
                      {req.description ||
                        "Field inspection and issue resolution"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {isPending ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleReject(e, item.id)}
                          className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-3.5" />
                          <span>Reject</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => handleAccept(e, item.id)}
                          className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="size-3.5" />
                          <span>Accept</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        render={
                          <Link href={`/resolver/assignments/${item.id}`} />
                        }
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5"
                      >
                        <span>Details & Logs</span>
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
