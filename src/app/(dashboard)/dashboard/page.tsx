"use client";

import Link from "next/link";
import { useGetMe, useGetMyRequests } from "@/hooks";
import {
  StatCard,
  StatusBadge,
  PageHeader,
  EmptyState,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CitizenDashboardPage() {
  const { data: meData } = useGetMe();
  const { data: requestsData, isLoading } = useGetMyRequests({ limit: 10 });

  const user = meData?.data;
  const requests = requestsData?.data || [];

  // Derived metrics
  const totalRequests = requestsData?.meta?.total ?? requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "SUBMITTED",
  ).length;
  const inProgressCount = requests.filter(
    (r) =>
      r.status === "IN_PROGRESS" ||
      r.status === "ASSIGNED" ||
      r.status === "ACCEPTED",
  ).length;
  const resolvedCount = requests.filter(
    (r) => r.status === "RESOLVED" || r.status === "COMPLETED",
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8 backdrop-blur-md shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              <span>City Sense Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "Citizen"}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track issues, request municipal services, and stay updated on
              resolutions in your neighborhood.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/dashboard/requests/new" />}
              className="gap-2 shadow-xs"
            >
              <Plus className="size-4" />
              <span>Submit Request</span>
            </Button>
            <Button
              render={<Link href="/dashboard/services" />}
              variant="outline"
              className="gap-2"
            >
              <span>Explore Services</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={totalRequests}
          subtitle="All time requests"
          icon={<ClipboardList className="size-5" />}
        />
        <StatCard
          title="Pending Action"
          value={pendingCount}
          subtitle="Awaiting review"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Being resolved"
          icon={<AlertCircle className="size-5" />}
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Successfully closed"
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Recent Activity
            </h2>
            <p className="text-xs text-muted-foreground">
              Your latest submitted requests and reports
            </p>
          </div>
          {requests.length > 0 && (
            <Link
              href="/dashboard/my-requests"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border/40 p-8 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
            Loading your requests...
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No requests submitted yet"
            description="Have a civic issue or need a public service? Submit your first request today."
            action={
              <Button
                render={<Link href="/dashboard/requests/new" />}
                size="sm"
              >
                <Plus className="mr-1 size-3.5" />
                Submit New Request
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
            {requests.slice(0, 5).map((req) => (
              <Link
                key={req.id}
                href={`/dashboard/my-requests/${req.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-medium text-muted-foreground">
                      #{req.requestNumber || req.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    <span className="text-[11px] text-muted-foreground">
                      {req.type === "COMPLAINT"
                        ? "Complaint"
                        : "Service Request"}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {req.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-xl">
                    {req.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex size-7 items-center justify-center rounded-lg border border-border/40 bg-background/60 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
