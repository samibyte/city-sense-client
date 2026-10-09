"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetMyRequests, useCancelRequest } from "@/hooks";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ArrowRight,
  Filter,
  XCircle,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import type { RequestStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function MyRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data, isLoading } = useGetMyRequests();
  const { mutate: cancelReq, isPending: isCancelling } = useCancelRequest();

  const allRequests = data?.data || [];

  const filtered = allRequests.filter((req) => {
    const matchesSearch =
      searchTerm === "" ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "ALL") return true;
    if (statusFilter === "PENDING") {
      return req.status === "PENDING" || req.status === "SUBMITTED";
    }
    if (statusFilter === "IN_PROGRESS") {
      return (
        req.status === "IN_PROGRESS" ||
        req.status === "ASSIGNED" ||
        req.status === "ACCEPTED"
      );
    }
    if (statusFilter === "RESOLVED") {
      return req.status === "RESOLVED" || req.status === "COMPLETED";
    }
    if (statusFilter === "CANCELLED") {
      return req.status === "CANCELLED" || req.status === "REJECTED";
    }
    return req.status === statusFilter;
  });

  const handleCancel = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to cancel this request?")) {
      cancelReq(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="My Requests"
        description="Track the status and history of all your submitted complaints and service requests."
      >
        <Button
          render={<Link href="/dashboard/requests/new" />}
          className="gap-2 shadow-xs"
        >
          <Plus className="size-4" />
          <span>New Request</span>
        </Button>
      </PageHeader>

      {/* Controls: Search and Filter Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, number, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading requests...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== "ALL"
              ? "No matching requests found"
              : "No requests yet"
          }
          description={
            searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search terms or filter."
              : "Submit an inquiry, complaint, or request to get started."
          }
          action={
            <Button render={<Link href="/dashboard/requests/new" />} size="sm">
              <Plus className="mr-1.5 size-4" />
              Submit Request
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isCancellable =
              req.status === "PENDING" || req.status === "SUBMITTED";

            return (
              <div
                key={req.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-xs"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      #{req.requestNumber || req.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    <span className="text-xs text-muted-foreground/80">
                      •{" "}
                      {req.type === "COMPLAINT"
                        ? "Complaint"
                        : "Service Request"}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/my-requests/${req.id}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {req.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground/70" />
                      {new Date(req.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center pt-2 md:pt-0">
                  {isCancellable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleCancel(e, req.id)}
                      disabled={isCancelling}
                      className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive h-8"
                    >
                      <XCircle className="size-3.5 mr-1" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    render={<Link href={`/dashboard/my-requests/${req.id}`} />}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
