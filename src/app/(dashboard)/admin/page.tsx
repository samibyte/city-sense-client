"use client";

import Link from "next/link";
import { useGetAdminStats, useGetAllRequests } from "@/hooks";
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
  Users,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: statsData, isLoading: isStatsLoading } = useGetAdminStats();
  const { data: reqData, isLoading: isReqLoading } = useGetAllRequests({
    limit: 6,
  });

  const stats = (statsData?.data as any) || {};
  const reqs = reqData?.data || [];

  const requestsStats = stats.requests || {};
  const usersStats = stats.users || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8 backdrop-blur-md shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              <span>Operations Control</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Municipal Administration
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time oversight of city service operations, citizen grievance
              triage, and field resolver dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/admin/requests" />}
              className="gap-2 shadow-xs"
            >
              <ClipboardList className="size-4" />
              <span>Dispatch Queue</span>
            </Button>
            <Button
              render={<Link href="/admin/resolver-applications" />}
              variant="outline"
              className="gap-2"
            >
              <span>Resolver Applications</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries"
          value={requestsStats.total ?? "—"}
          subtitle="All complaints & services"
          icon={<ClipboardList className="size-5" />}
        />
        <StatCard
          title="Submitted / Pending"
          value={requestsStats.submitted ?? "—"}
          subtitle="Awaiting triage & assignment"
          icon={<Clock className="size-5" />}
        />
        <StatCard
          title="Active in Field"
          value={
            (requestsStats.assigned || 0) + (requestsStats.inProgress || 0)
          }
          subtitle="Assigned or in progress"
          icon={<AlertCircle className="size-5" />}
        />
        <StatCard
          title="Resolved"
          value={(requestsStats.resolved || 0) + (requestsStats.completed || 0)}
          subtitle="Successfully closed"
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Registered Citizens"
          value={usersStats.citizens ?? usersStats.total ?? "—"}
          subtitle="Civic platform users"
          icon={<Users className="size-5" />}
        />
        <StatCard
          title="Field Resolvers"
          value={usersStats.resolvers ?? "—"}
          subtitle="Verified dispatch staff"
          icon={<ShieldCheck className="size-5" />}
        />
        <StatCard
          title="Catalog Services"
          value={stats.services ?? "—"}
          subtitle="Across municipal depts"
          icon={<Building className="size-5" />}
        />
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Recent Inquiries & Grievances
            </h2>
            <p className="text-xs text-muted-foreground">
              Latest requests requiring administrative triage or tracking
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View all queue</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isReqLoading ? (
          <div className="rounded-2xl border border-border/40 p-8 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
            Loading recent requests...
          </div>
        ) : reqs.length === 0 ? (
          <EmptyState
            title="No incoming requests"
            description="The administrative queue is currently clear."
          />
        ) : (
          <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
            {reqs.map((req) => (
              <Link
                key={req.id}
                href={`/admin/requests/${req.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-medium text-muted-foreground">
                      #{req.requestNumber || req.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    <span className="text-[11px] text-muted-foreground">
                      {req.type === "COMPLAINT" ? "Complaint" : "Service"}
                    </span>
                    {req.category?.name && (
                      <span className="text-[11px] text-muted-foreground/80">
                        • {req.category.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {req.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-xl">
                    {req.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {req.citizen?.user?.name || "Citizen"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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
