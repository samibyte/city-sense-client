"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks";
import {
  PAYMENT_REQUEST_ID_PARAM,
  PAYMENT_SESSION_ID_PARAM,
} from "@/lib/payment";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function PaymentSuccessResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get(PAYMENT_SESSION_ID_PARAM);
  const requestId = searchParams.get(PAYMENT_REQUEST_ID_PARAM);

  const { mutate, isPending, isError, isSuccess } = useConfirmPayment();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !sessionId) {
      return;
    }

    started.current = true;
    mutate(sessionId);
  }, [sessionId, mutate]);

  if (!sessionId) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 backdrop-blur-md text-center max-w-md mx-auto space-y-4">
        <p className="text-sm text-muted-foreground">
          No checkout session found in the redirect. Start the payment again
          from your request.
        </p>
        <Button render={<Link href="/dashboard/my-requests" />} size="sm">
          Return to Requests
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 backdrop-blur-md text-center max-w-md mx-auto space-y-3">
        <div className="flex justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Confirming your transaction with Stripe...
        </p>
        <p className="text-xs text-muted-foreground">
          Please wait while we record your payment receipt.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-card/40 p-8 backdrop-blur-md text-center max-w-md mx-auto space-y-4 shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            Payment Received
          </h2>
          <p className="text-xs text-muted-foreground">
            Your municipal service order is now funded and will be routed to
            field teams for scheduling.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          {requestId ? (
            <Button
              render={<Link href={`/dashboard/my-requests/${requestId}`} />}
              className="gap-1.5"
            >
              <span>View Request Status</span>
              <ArrowRight className="size-3.5" />
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

  return (
    <div className="rounded-2xl border border-destructive/30 bg-card/40 p-8 backdrop-blur-md text-center max-w-md mx-auto space-y-4 shadow-sm">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
        <AlertTriangle className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">
          Confirmation Notice
        </h2>
        <p className="text-xs text-muted-foreground">
          If your card was charged, your webhook receipt may still be syncing.
          Check back in your requests in a moment.
        </p>
      </div>
      <div className="pt-2">
        <Button
          render={<Link href="/dashboard/my-requests" />}
          variant="outline"
        >
          Return to My Requests
        </Button>
      </div>
    </div>
  );
}
