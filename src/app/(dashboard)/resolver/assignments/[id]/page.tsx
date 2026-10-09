"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useGetAssignmentById,
  useAcceptAssignment,
  useRejectAssignment,
  useUpdateAssignmentStatus,
} from "@/hooks";
import { StatusBadge, PriorityBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Check,
  X,
  Play,
  Sparkles,
} from "lucide-react";

export default function ResolverAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading } = useGetAssignmentById(id);
  const { mutate: accept, isPending: isAccepting } = useAcceptAssignment();
  const { mutate: reject, isPending: isRejecting } = useRejectAssignment();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAssignmentStatus();

  const [notes, setNotes] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const assignment = (data?.data as any) || null;
  const req = assignment?.request || {};

  const handleAccept = () => {
    accept(id, {
      onSuccess: () => setFeedbackMsg("Assignment accepted successfully."),
    });
  };

  const handleReject = () => {
    const reason = prompt("Enter reason for rejection:");
    if (reason) {
      reject(
        { id, reason },
        {
          onSuccess: () => setFeedbackMsg("Assignment rejected."),
        },
      );
    }
  };

  const handleTransition = (newStatus: string) => {
    updateStatus(
      {
        id,
        payload: {
          status: newStatus,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: () => {
          setFeedbackMsg(`Assignment status updated to ${newStatus}.`);
          setNotes("");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading assignment details...
        </p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="rounded-2xl border border-border/40 p-12 text-center bg-card/20 backdrop-blur-xs">
        <h3 className="text-base font-medium">Assignment not found</h3>
        <Button
          render={<Link href="/resolver/assignments" />}
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
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/resolver/assignments" />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Assignments</span>
        </Button>
      </div>

      {/* Main Header */}
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              Assignment #{assignment.id.slice(0, 8)}
            </span>
            <StatusBadge status={assignment.status} />
            <PriorityBadge priority={assignment.priority} />
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Assigned {new Date(assignment.createdAt).toLocaleString()}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {req.title || "Civic Incident Work Order"}
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

      {/* Field Actions Panel */}
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span>Field Operation Controls</span>
        </h3>

        {assignment.status === "PENDING" && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="size-4" />
              <span>Accept Assignment</span>
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              variant="outline"
              className="gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <X className="size-4" />
              <span>Decline Task</span>
            </Button>
          </div>
        )}

        {(assignment.status === "ACCEPTED" ||
          assignment.status === "IN_PROGRESS") && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Work Log / Resolution Notes:
              </label>
              <Textarea
                placeholder="Log actions taken, on-site findings, materials replaced, or completion notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-background/80"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {assignment.status === "ACCEPTED" && (
                <Button
                  onClick={() => handleTransition("IN_PROGRESS")}
                  disabled={isUpdating}
                  className="gap-1.5 shadow-xs"
                >
                  <Play className="size-4" />
                  <span>Mark In Progress</span>
                </Button>
              )}

              {assignment.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => handleTransition("COMPLETED")}
                  disabled={isUpdating}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Mark Work Completed</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {assignment.status === "COMPLETED" && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
            This work order has been completed and verified.
          </div>
        )}
      </div>

      {/* Location & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Coordinates */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            On-Site Location
          </h3>
          {req.location ? (
            <div className="space-y-1 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{req.location.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.location.area}, {req.location.city}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No specific location attached.
            </p>
          )}
        </div>

        {/* Citizen Contact */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Citizen Contact
          </h3>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground text-sm">
              {req.citizen?.user?.name || "Citizen Reporter"}
            </p>
            <p>Phone: {req.citizen?.user?.phone || "N/A"}</p>
            <p>Email: {req.citizen?.user?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Attachments if any */}
      {req.requestAttachment && req.requestAttachment.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Incident Attachments ({req.requestAttachment.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {req.requestAttachment.map((file: any, i: number) => (
              <a
                key={file.id || i}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-3 hover:bg-muted/40 transition-colors text-center"
              >
                <FileText className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="mt-2 text-xs font-medium text-foreground truncate max-w-full">
                  {file.name || `Attachment ${i + 1}`}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  View <ExternalLink className="size-2.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
