import apiClient from "@/lib/apiClient";
import type { ApiResponse, Payment } from "@/types";

export function createPayment(requestId: string) {
  return apiClient<ApiResponse<Payment>>("/payments/create", {
    method: "POST",
    body: { requestId },
  });
}

export function confirmPayment(transactionId: string) {
  return apiClient<ApiResponse<Payment>>("/payments/confirm", {
    method: "POST",
    body: { transactionId },
  });
}

export function getPaymentByRequestId(requestId: string) {
  return apiClient<ApiResponse<Payment | null>>(`/payments/${requestId}`);
}
