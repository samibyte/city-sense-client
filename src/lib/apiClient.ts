import { ofetch } from "ofetch";
import type { AuthTokens } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Endpoints that must never trigger the refresh-and-retry flow: they either
 * establish a session, renew it, or are expected to fail with a 401.
 */
const REFRESH_EXEMPT_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/send-verification-otp",
];

/** ofetch's built-in retry list, extended with 401 so we can refresh first. */
const RETRY_STATUS_CODES = [408, 409, 425, 429, 500, 502, 503, 504, 401];

/** Marker carried onto the replayed request so it refreshes at most once. */
type RefreshAwareOptions = { skipRefresh?: boolean };

/**
 * Hook-free client used only for the refresh call itself. Because it has no
 * `onResponseError`, a failing refresh can never recurse back into this logic.
 */
const authClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

/**
 * A single in-flight refresh shared by every concurrent 401, so a burst of
 * parallel requests triggers exactly one token rotation instead of one each.
 * Resolves to false when the session is genuinely over.
 */
let refreshInFlight: Promise<boolean> | null = null;

function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = authClient
      .raw<AuthTokens>("/auth/refresh-token", { method: "POST" })
      .then((res) => res.status >= 200 && res.status < 300)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  retry: 1,
  retryStatusCodes: RETRY_STATUS_CODES,
  onResponseError: async ({ request, options, response }) => {
    const opts = options as RefreshAwareOptions;
    const pathname =
      typeof request === "string" ? new URL(request, BASE_URL).pathname : "";

    const shouldRefresh =
      response?.status === 401 &&
      !opts.skipRefresh &&
      !REFRESH_EXEMPT_PATHS.some((exempt) => pathname.endsWith(exempt));

    if (!shouldRefresh) {
      // Throwing here also suppresses ofetch's retry, which is what we want for
      // exempt paths and for requests that already used their single retry.
      throw response;
    }

    // ofetch replays the request once this hook resolves, because 401 is in
    // retryStatusCodes. Flag the replay so it cannot trigger a second refresh.
    opts.skipRefresh = true;

    if (!(await refreshSession())) {
      throw response;
    }
  },
});

export default apiClient;
