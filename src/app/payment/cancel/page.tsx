import { Suspense } from "react";
import PaymentCancelResult from "./payment-cancel-result";

export const metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-semibold">Payment cancelled</h1>
      <div className="mt-4">
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <PaymentCancelResult />
        </Suspense>
      </div>
    </main>
  );
}
