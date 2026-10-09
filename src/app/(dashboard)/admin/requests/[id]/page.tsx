"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useGetRequestById,
  useGetAvailableResolvers,
  useAssignRequest,
  useReassignRequest,
  useUpdateRequestStatus,
} from "@/hooks";
import { StatusBadge, PriorityBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Building,
} from "lucide-react";
import type { RequestWithRelations } from "@/types";

export default function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading } = useGetRequestById(id);
  const { data: resolversData } = useGetAvailableResolvers();

  const { mutate: assign, isPending: isAssigning } = useAssignRequest();
  const { mutate: reassign, isPending: isReassigning } = useReassignRequest();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateRequestStatus();

  // Assignment state
  const [selectedResolverId, setSelectedResolverId] = useState("");
  const [assignPriority, setAssignPriority] = useState<string>("MEDIUM");
  const [reassignReason, setReassignReason] = useState("");

  // Status update state
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const req = data?.data as RequestWithRelations | undefined;
  const availableResolvers = resolversData?.data || [];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResolverId) return;

    if (req?.assignedResolverId) {
      // Reassign
      reassign(
        {
          requestId: id,
          resolverId: selectedResolverId,
          reason: reassignReason || undefined,
        },
        {
          onSuccess: () => {
            setFeedbackMsg("Request successfully reassigned to new resolver.");
          },
          onError: (err: any) => {
            setFeedbackMsg(err?.message || "Failed to reassign request.");
          },
        },
      );
    } else {
      // First assignment
      assign(
        {
          requestId: id,
          resolverId: selectedResolverId,
          priority: assignPriority,
        },
        {
          onSuccess: () => {
            setFeedbackMsg("Request successfully assigned.");
          },
          onError: (err: any) => {
            setFeedbackMsg(err?.message || "Failed to assign request.");
          },
        },
      );
    }
  };

  const handleStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    updateStatus(
      {
        id,
        payload: {
          status: newStatus,
          notes: statusNotes || undefined,
        },
      },
      {
        onSuccess: () => {
          setFeedbackMsg("Status successfully updated.");
          setStatusNotes("");
        },
        onError: (err: any) => {
          setFeedbackMsg(err?.message || "Failed to update status.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading request details...
        </p>
      </div>
    );
  }

  if (!req) {
    return (
      <div className="rounded-2xl border border-border/40 p-12 text-center bg-card/20 backdrop-blur-xs">
        <h3 className="text-base font-medium">Request not found</h3>
        <Button
          render={<Link href="/admin/requests" />}
          variant="outline"
          className="mt-4"
        >
          Return to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/admin/requests" />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Requests</span>
        </Button>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              #{req.requestNumber || req.id.slice(0, 8)}
            </span>
            <StatusBadge status={req.status} />
            <PriorityBadge priority={req.priority} />
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Submitted {new Date(req.createdAt).toLocaleString()}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {req.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {req.description}
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-xs text-primary flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Action Panels: Assignment & Status Update */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assignment Box */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <ShieldCheck className="size-4 text-primary" />
            <span>
              {req.assignedResolverId
                ? "Reassign Field Staff"
                : "Assign Field Resolver"}
            </span>
          </div>

          <form onSubmit={handleAssign} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Select Available Resolver:
              </label>
              <select
                value={selectedResolverId}
                onChange={(e) => setSelectedResolverId(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Choose a resolver...</option>
                {availableResolvers.map((res: any) => (
                  <option key={res.id} value={res.id}>
                    {res.user?.name || "Resolver"} (
                    {res.department?.name || "Dept"}) •{" "}
                    {res.operationalCity || "Area"}
                  </option>
                ))}
              </select>
            </div>

            {!req.assignedResolverId && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Dispatch Priority:
                </label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Urgent)</option>
                </select>
              </div>
            )}

            {req.assignedResolverId && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Reassignment Reason (Optional):
                </label>
                <Input
                  placeholder="e.g., Workload transfer / out of sector"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  className="text-xs bg-background/80"
                />
              </div>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={isAssigning || isReassigning}
              className="w-full gap-1.5"
            >
              <Send className="size-3.5" />
              <span>
                {req.assignedResolverId
                  ? isReassigning
                    ? "Reassigning..."
                    : "Reassign Resolver"
                  : isAssigning
                    ? "Assigning..."
                    : "Dispatch to Resolver"}
              </span>
            </Button>
          </form>
        </div>

        {/* Status Override Box */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <AlertCircle className="size-4 text-primary" />
            <span>Update Request Status</span>
          </div>

          <form onSubmit={handleStatusChange} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                New Status:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select target status...</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Administrative Notes:
              </label>
              <Input
                placeholder="Log note or reason for status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="text-xs bg-background/80"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={isUpdatingStatus}
              className="w-full gap-1.5"
            >
              <span>{isUpdatingStatus ? "Updating..." : "Update Status"}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Citizen & Location Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Citizen Information */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Citizen Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span className="font-medium text-foreground">
                {req.citizen?.user?.name || "Anonymous Citizen"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Email: {req.citizen?.user?.email || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground pl-6">
              Phone: {req.citizen?.user?.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Location Information */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location Coordinates
          </h3>
          {req.location ? (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground text-sm">
                {req.location.address}
              </p>
              <p>
                {req.location.area}, {req.location.city}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No location details available.
            </p>
          )}
        </div>
      </div>

      {/* Attachments if any */}
      {req.requestAttachment && req.requestAttachment.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evidence Files ({req.requestAttachment.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {req.requestAttachment.map((file, i) => (
              <a
                key={file.publicId || i}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-3 hover:bg-muted/40 transition-colors text-center"
              >
                <FileText className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="mt-2 text-xs font-medium text-foreground truncate max-w-full">
                  Attachment {i + 1}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  View <ExternalLink className="size-2.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* History timeline */}
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audit Log & Timeline
        </h3>

        {req.statusHistory && req.statusHistory.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {req.statusHistory.map((history, i) => (
              <div key={history.id || i} className="relative">
                <div className="absolute -left-6 top-1 size-2 rounded-full bg-primary ring-4 ring-background" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={history.status} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(history.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {history.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {history.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No events logged.</p>
        )}
      </div>
    </div>
  );
}
