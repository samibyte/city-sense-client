/**
 * Routes and query parameters of the Stripe Checkout redirect. The server
 * builds these URLs itself (see `payment.service.ts`), so renaming a path or
 * parameter here requires a matching change on the API.
 */
export const PAYMENT_SUCCESS_PATH = "/payment/success";
export const PAYMENT_CANCEL_PATH = "/payment/cancel";

/** Stripe appends `{CHECKOUT_SESSION_ID}` to the success URL. */
export const PAYMENT_SESSION_ID_PARAM = "session_id";

/** The server appends `{REQUEST_ID}` to both the success and cancel URLs. */
export const PAYMENT_REQUEST_ID_PARAM = "requestId";
