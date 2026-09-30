export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "CASH";

export interface Payment {
  id: string;
  /** Prisma Decimal, serialized as a string by the API. */
  amount: string;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  paymentMethod: PaymentMethod | null;
  paymentProvider: string | null;
  refundedAt: string | null;
  refundReason: string | null;
  stripeEventId: string | null;
  paymentGatewayData: unknown | null;
  createdAt: string;
  updatedAt: string;
  requestId: string | null;
  citizenId: string | null;
  serviceId: string | null;
}
