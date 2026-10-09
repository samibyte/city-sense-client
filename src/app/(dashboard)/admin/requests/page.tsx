"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAllRequests } from "@/hooks";
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
  ArrowRight,
  Filter,
  Calendar,
  User,
  MapPin,
  Building,
} from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Complaints", value: "COMPLAINT" },
  { label: "Services", value: "SERVICE_REQUEST" },
];

export default function AdminRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useGetAllRequests({
    searchTerm: searchTerm || undefined,
    status: status || undefined,
    type: type || undefined,
    limit: 50,
  });

  const requests = data?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Request & Incident Queue"
        description="Review, triage, and assign incoming civic complaints and service orders."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, number, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-xs"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-xs"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading requests queue...
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests match criteria"
          description="Try clearing search filters or changing the status filter."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
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
                  <PriorityBadge priority={req.priority} />
                  <span className="text-xs text-muted-foreground/80">
                    •{" "}
                    {req.type === "COMPLAINT" ? "Complaint" : "Service Request"}
                  </span>
                  {req.category?.name && (
                    <span className="text-xs text-muted-foreground/80">
                      • {req.category.name}
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/requests/${req.id}`}
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
                    <User className="size-3.5 text-muted-foreground/70" />
                    {req.citizen?.user?.name || "Citizen"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground/70" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                  {req.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground/70" />
                      {req.location.area || req.location.city}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <Button
                  render={<Link href={`/admin/requests/${req.id}`} />}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                >
                  <span>Manage</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
