"use client";

import { useState } from "react";
import { useGetApplications, useReviewApplication } from "@/hooks";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Check,
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";

export default function AdminResolverApplicationsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const { data, isLoading } = useGetApplications();
  const { mutate: reviewApp, isPending: isReviewing } = useReviewApplication();

  const applications = (data?.data as any) || [];

  const filtered = applications.filter((app: any) => {
    if (filter === "ALL") return true;
    return app.verificationStatus === filter;
  });

  const handleReview = (id: string, status: "APPROVED" | "REJECTED") => {
    let rejectionReason: string | undefined = undefined;
    if (status === "REJECTED") {
      const reason = prompt("Enter reason for rejection:");
      if (!reason) return;
      rejectionReason = reason;
    }

    reviewApp({
      id,
      status,
      rejectionReason,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Field Resolver Applications"
        description="Verify and review candidate qualifications, credentials, and departmental placement."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === tab
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-border/40"
            }`}
          >
            {tab === "ALL" ? "All Applications" : tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading applications...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="There are currently no resolver submissions in this category."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((app: any) => {
            const isPending = app.verificationStatus === "PENDING";

            return (
              <div
                key={app.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-xs"
              >
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-foreground">
                      {app.user?.name || "Resolver Candidate"}
                    </h3>
                    <StatusBadge status={app.verificationStatus} size="sm" />
                    {app.department?.name && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/90">
                        <Building className="size-3 text-primary" />
                        {app.department.name}
                      </span>
                    )}
                  </div>

                  {app.bio && (
                    <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                      {app.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground/70" />
                      {app.city || app.area || "City Wide"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground/70" />
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.resume && (
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <FileText className="size-3.5" />
                        <span>Resume / CV</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button
                      onClick={() => handleReview(app.id, "REJECTED")}
                      disabled={isReviewing}
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                      <span>Reject</span>
                    </Button>
                    <Button
                      onClick={() => handleReview(app.id, "APPROVED")}
                      disabled={isReviewing}
                      size="sm"
                      className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="size-3.5" />
                      <span>Approve</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
