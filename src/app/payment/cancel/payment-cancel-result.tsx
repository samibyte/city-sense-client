"use client";

import { PAYMENT_REQUEST_ID_PARAM } from "@/lib/payment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelResult() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get(PAYMENT_REQUEST_ID_PARAM);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 p-8 backdrop-blur-md text-center max-w-md mx-auto space-y-4 shadow-sm">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
        <XCircle className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Payment Cancelled</h2>
        <p className="text-xs text-muted-foreground">
          No charge was completed. You can resume payment at any time from your
          request details.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        {requestId ? (
          <Button
            render={<Link href={`/dashboard/my-requests/${requestId}`} />}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Request</span>
          </Button>
        ) : (
          <Button render={<Link href="/dashboard/my-requests" />}>
            My Requests
          </Button>
        )}
      </div>
    </div>
  );
}
