import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types";

// ---------------------------------------------------------------------------
// Route definitions (mirrors src/routes/* and src/routes/index.ts)
// ---------------------------------------------------------------------------

/** Auth-only pages — authenticated users should not linger here. */
const AUTH_ONLY_PATHS = ["/auth"];

/** Role-prefixed protected areas. */
const PROTECTED_PREFIXES: Record<string, UserRole> = {
  "/dashboard": "CITIZEN",
  "/resolver": "RESOLVER",
  "/admin": "ADMIN",
};

/** Where each role lands after a successful login. */
const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  ADMIN: "/admin",
  RESOLVER: "/resolver",
  CITIZEN: "/dashboard",
};

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

interface JwtClaims {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Decode a JWT **without** verifying its signature.
 *
 * In the proxy (Node.js runtime) we don't have the server secret, so we can
 * only do an optimistic check — the payload is still Base-64 encoded and
 * readable.  Actual signature verification happens on the API for every
 * protected request.
 */
function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // atob is available in the Node.js runtime; add URL-safe base64 padding.
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

/**
 * Returns the decoded access-token claims when the cookie is present and
 * structurally valid, or `null` when the user is unauthenticated / token is
 * malformed.
 *
 * **Important**: This is an optimistic check only.  Actual token validation
 * (signature, expiry) is always enforced by the API; the `AuthGuard` and
 * `RoleGuard` components re-verify on the client via `GET /auth/me`.
 */
function getAuthClaims(request: NextRequest): JwtClaims | null {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return null;

  const claims = decodeJwt(token);
  if (!claims) return null;

  // Treat structurally expired tokens as unauthenticated — the client-side
  // apiClient will silently refresh, but the proxy should bounce early rather
  // than exposing a protected page briefly.
  if (claims.exp && claims.exp * 1000 < Date.now()) return null;

  // Only accept known roles.
  if (!["ADMIN", "RESOLVER", "CITIZEN"].includes(claims.role)) return null;

  return claims;
}

// ---------------------------------------------------------------------------
// Redirect helper
// ---------------------------------------------------------------------------

function redirectTo(path: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

// ---------------------------------------------------------------------------
// Proxy — named export required by Next.js 16 convention.
// ---------------------------------------------------------------------------

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  const claims = getAuthClaims(request);
  const isAuthenticated = claims !== null;

  // ── 1. Auth-only pages (login, verify-account) ──────────────────────────
  // Authenticated users are sent straight to their dashboard.
  if (
    AUTH_ONLY_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    )
  ) {
    if (isAuthenticated) {
      return redirectTo(DASHBOARD_BY_ROLE[claims.role], request);
    }
    // Not authenticated — let the page render normally.
    return undefined;
  }

  // ── 2. Role-prefixed protected areas ────────────────────────────────────
  const matchedPrefix = Object.keys(PROTECTED_PREFIXES).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (matchedPrefix) {
    // 2a. Not logged in → send to login with the original path preserved.
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2b. Wrong role → bounce to the user's own dashboard.
    //     The client-side RoleGuard renders an AccessDenied screen, but the
    //     proxy-level bounce prevents the wrong layout from ever flashing.
    const requiredRole = PROTECTED_PREFIXES[matchedPrefix];
    if (claims.role !== requiredRole) {
      return redirectTo(DASHBOARD_BY_ROLE[claims.role], request);
    }

    // 2c. Correct role — pass through.
    return undefined;
  }

  // ── 3. Payment page ──────────────────────────────────────────────────────
  // /payment is reachable by any authenticated role.
  if (pathname === "/payment" || pathname.startsWith("/payment/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return undefined;
  }

  // ── 4. Everything else (marketing pages, public routes) ─────────────────
  return undefined;
}

// ---------------------------------------------------------------------------
// Matcher — skip Next.js internals and static assets.
//
// Note: Even when _next/data is excluded in the pattern, proxy still runs for
// those routes (intentional Next.js security behaviour documented in the
// proxy.md API reference).
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     *   - _next/static  (static chunk files)
     *   - _next/image   (image optimisation pipeline)
     *   - favicon.ico, sitemap.xml, robots.txt (public metadata files)
     *   - Any path ending with a file extension (e.g. .png, .svg, .woff2)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.\\w+$).*)",
  ],
};
