"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useConfirmPayment } from "@/hooks";
import {
  PAYMENT_REQUEST_ID_PARAM,
  PAYMENT_SESSION_ID_PARAM,
} from "@/lib/payment";

/**
 * Confirms the Stripe Checkout session as soon as the browser lands here.
 * Split into its own component because it reads the query string, which
 * requires a Suspense boundary when the app is statically exported.
 */
export default function PaymentSuccessResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get(PAYMENT_SESSION_ID_PARAM);
  const requestId = searchParams.get(PAYMENT_REQUEST_ID_PARAM);

  const { mutate, isPending, isError, isSuccess } = useConfirmPayment();
  // Guards against React 18 Strict Mode firing the effect twice.
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
      <p className="text-muted-foreground">
        No checkout session found in the redirect. Start the payment again from
        the request.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Spinner /> Confirming your payment
      </div>
    );
  }

  if (isSuccess) {
    return (
      <p>
        Payment confirmed
        {requestId ? ` for request ${requestId}` : ""}.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Payment confirmation failed. If you were charged, contact support with
        session {sessionId}.
      </p>
    );
  }

  return <p className="text-muted-foreground">Preparing confirmation…</p>;
}
