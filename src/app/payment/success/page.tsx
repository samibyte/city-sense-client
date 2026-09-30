import { Suspense } from "react";
import PaymentSuccessResult from "./payment-success-result";

export const metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <div className="mt-4">
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <PaymentSuccessResult />
        </Suspense>
      </div>
    </main>
  );
}
