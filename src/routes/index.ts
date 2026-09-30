import type { UserRole } from "@/types";
import { adminRoutes } from "./admin.routes";
import { citizenRoutes } from "./citizen.routes";
import { resolverRoutes } from "./resolver.routes";

export * from "./admin.routes";
export * from "./citizen.routes";
export * from "./resolver.routes";

export const routesByRole = {
  ADMIN: adminRoutes,
  RESOLVER: resolverRoutes,
  CITIZEN: citizenRoutes,
} satisfies Record<UserRole, unknown>;

export function getRoutesForRole(role: UserRole) {
  return routesByRole[role];
}

/** Where each role lands after logging in. */
export const dashboardPathByRole = {
  ADMIN: "/admin",
  RESOLVER: "/resolver",
  CITIZEN: "/dashboard",
} satisfies Record<UserRole, string>;
