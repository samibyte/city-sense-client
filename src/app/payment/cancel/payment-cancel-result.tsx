"use client";

import { PAYMENT_REQUEST_ID_PARAM } from "@/lib/payment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Reads the redirect query string, so it must sit behind a Suspense boundary
 * when the app is statically exported. `searchParams` cannot be awaited in the
 * page itself, because that would opt the route out of static rendering.
 */
export default function PaymentCancelResult() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get(PAYMENT_REQUEST_ID_PARAM);

  return (
    <>
      <p className="text-muted-foreground mt-2">
        No charge was made
        {requestId ? ` for request ${requestId}` : ""}.
      </p>
      <Link href="/dashboard" className="underline mt-4 inline-block">
        Back to dashboard
      </Link>
    </>
  );
}
