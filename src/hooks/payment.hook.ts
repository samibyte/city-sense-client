import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmPayment, createPayment, getPaymentByRequestId } from "@/api";

const paymentKeys = {
  byRequest: (requestId: string) => ["payments", requestId] as const,
};

export function useGetPaymentByRequestId(requestId: string) {
  return useQuery({
    queryKey: paymentKeys.byRequest(requestId),
    queryFn: () => getPaymentByRequestId(requestId),
    enabled: Boolean(requestId),
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (requestId: string) => createPayment(requestId),
  });
}

/**
 * Confirms a completed Stripe Checkout session. Called from the payment
 * success page, which reads the session id out of the redirect query string.
 */
export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => confirmPayment(transactionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
}
