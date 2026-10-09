"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetMyAssignments,
  useAcceptAssignment,
  useRejectAssignment,
} from "@/hooks";
import {
  PageHeader,
  StatusBadge,
  PriorityBadge,
  EmptyState,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Check,
  X,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";

const FILTER_TABS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function ResolverAssignmentsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetMyAssignments({ limit: 50 });
  const { mutate: accept, isPending: isAccepting } = useAcceptAssignment();
  const { mutate: reject, isPending: isRejecting } = useRejectAssignment();

  const assignments = (data?.data as any) || [];

  const filtered = assignments.filter((item: any) => {
    const req = item.request || {};
    const title = req.title || "";
    const matchesSearch =
      searchTerm === "" ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return item.status === statusFilter;
  });

  const handleAccept = (id: string) => {
    accept(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt("Enter reason for rejecting this assignment:");
    if (reason) {
      reject({ id, reason });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Field Assignments Queue"
        description="Inspect tasks assigned to you, accept incoming dispatches, and log work progress."
      />

      {/* Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading assignments...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Try adjusting your filter selection or search query."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item: any) => {
            const req = item.request || {};
            const isPending = item.status === "PENDING";

            return (
              <div
                key={item.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-xs"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      #{req.requestNumber || item.requestId?.slice(0, 8)}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <PriorityBadge priority={item.priority} />
                    {req.category?.name && (
                      <span className="text-xs text-muted-foreground/80">
                        • {req.category.name}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/resolver/assignments/${item.id}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {req.title || "Civic Incident Work Order"}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {req.description ||
                      "Field inspection and incident response"}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground/70" />
                      Assigned {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {req.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-muted-foreground/70" />
                        {req.location.area ||
                          req.location.city ||
                          req.location.address}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isPending ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(item.id)}
                        disabled={isRejecting}
                        className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="size-3.5" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(item.id)}
                        disabled={isAccepting}
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
                      <span>Manage Task</span>
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
  );
}
