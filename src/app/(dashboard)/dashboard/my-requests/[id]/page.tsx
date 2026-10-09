"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetRequestById,
  useCreatePayment,
  useConfirmCompletion,
  useGiveFeedback,
} from "@/hooks";
import { StatusBadge, PriorityBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { RequestWithRelations } from "@/types";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { data, isLoading } = useGetRequestById(id);
  const { mutate: initiatePayment, isPending: isPaying } = useCreatePayment();
  const { mutate: confirmComplete, isPending: isConfirming } =
    useConfirmCompletion();
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } =
    useGiveFeedback();

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const req = data?.data as RequestWithRelations | undefined;

  const handlePay = () => {
    initiatePayment(id, {
      onSuccess: (res: any) => {
        const checkoutUrl = res?.data?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          alert("Payment session created successfully.");
        }
      },
      onError: (err: any) => {
        alert(err?.message || "Failed to initiate payment");
      },
    });
  };

  const handleConfirmCompletion = () => {
    if (
      confirm(
        "Confirm that this service or issue has been resolved to your satisfaction?",
      )
    ) {
      confirmComplete(id);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(
      {
        id,
        payload: {
          rating,
          comment: feedbackComment,
        },
      },
      {
        onSuccess: () => {
          setFeedbackSuccess(true);
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
        <p className="mt-1 text-sm text-muted-foreground">
          The requested record does not exist or you do not have permission to
          view it.
        </p>
        <Button
          render={<Link href="/dashboard/my-requests" />}
          variant="outline"
          className="mt-4"
        >
          Return to My Requests
        </Button>
      </div>
    );
  }

  const isPendingPayment =
    req.service?.isPaid &&
    req.status === "PENDING" &&
    req.payment?.status !== "PAID";

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/dashboard/my-requests" />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Requests</span>
        </Button>
      </div>

      {/* Header Banner */}
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

      {/* Payment Required Alert if applicable */}
      {isPendingPayment && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
              <CreditCard className="size-4" />
              <span>Payment Required</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This municipal service requires a fee of{" "}
              <strong className="text-foreground">
                ${req.service?.price || 0}
              </strong>{" "}
              before processing can begin.
            </p>
          </div>
          <Button
            onClick={handlePay}
            disabled={isPaying}
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            {isPaying ? "Processing..." : "Pay Now with Stripe"}
          </Button>
        </div>
      )}

      {/* Grid: Details & Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category & Service */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Service Classification
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium text-foreground">
                {req.category?.name || "General"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">
                {req.type === "COMPLAINT"
                  ? "Civic Complaint"
                  : "Service Request"}
              </span>
            </div>
            {req.service && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">
                  {req.service.name}
                </span>
              </div>
            )}
            {req.service?.estimatedDuration && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Duration:</span>
                <span className="font-medium text-foreground">
                  {req.service.estimatedDuration} hrs
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location Information
          </h3>
          {req.location ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-foreground">
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
              No specific location specified.
            </p>
          )}
        </div>
      </div>

      {/* Attachments Section if any */}
      {req.requestAttachment && req.requestAttachment.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Attachments & Evidence ({req.requestAttachment.length})
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

      {/* Resolution Confirmation & Feedback (if RESOLVED or COMPLETED) */}
      {(req.status === "RESOLVED" || req.status === "COMPLETED") && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <CheckCircle2 className="size-5" />
            <span>Resolution & Feedback</span>
          </div>

          {req.status === "RESOLVED" && !req.completedAt && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
              <p className="text-xs text-muted-foreground">
                The assigned resolver has marked this request as resolved.
                Please verify and confirm resolution.
              </p>
              <Button
                onClick={handleConfirmCompletion}
                disabled={isConfirming}
                size="sm"
                className="shrink-0"
              >
                {isConfirming ? "Confirming..." : "Confirm Resolution"}
              </Button>
            </div>
          )}

          {feedbackSuccess || req.feedback ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
              Thank you! Your feedback has been recorded.
            </div>
          ) : (
            <form onSubmit={handleSendFeedback} className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-foreground">
                Rate the resolution experience:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`size-5 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-foreground">
                  {rating} of 5 stars
                </span>
              </div>

              <Textarea
                placeholder="Share any thoughts, compliments, or details about the resolution..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={3}
                className="bg-background/60 text-xs"
              />

              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingFeedback}
                className="gap-1.5"
              >
                <Sparkles className="size-3.5" />
                <span>Submit Feedback</span>
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Status History Timeline */}
      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Activity & Timeline
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
          <p className="text-xs text-muted-foreground">
            No history logs recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}
