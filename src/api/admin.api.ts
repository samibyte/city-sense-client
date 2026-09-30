import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssignRequestPayload,
  RequestParams,
  RequestWithRelations,
  ResolverProfile,
  User,
} from "@/types";

export function getAdminStats() {
  return apiClient<ApiResponse<Record<string, unknown>>>("/admin/stats");
}

export function getAllRequests(params?: RequestParams) {
  return apiClient<ApiResponse<RequestWithRelations[]>>("/admin/requests", {
    params,
  });
}

export function getAvailableResolvers(params?: {
  departmentId?: string;
  city?: string;
  area?: string;
}) {
  return apiClient<ApiResponse<ResolverProfile[]>>(
    "/admin/resolvers/available",
    { params },
  );
}

export function assignRequest(payload: AssignRequestPayload) {
  return apiClient<ApiResponse<RequestWithRelations>>(
    "/admin/requests/assign",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function reassignRequest(payload: {
  requestId: string;
  resolverId: string;
  reason?: string;
}) {
  return apiClient<ApiResponse<RequestWithRelations>>(
    "/admin/requests/reassign",
    { method: "POST", body: payload },
  );
}

export function updateRequestStatus(
  id: string,
  payload: { status: string; notes?: string; priority?: string },
) {
  return apiClient<ApiResponse<RequestWithRelations>>(
    `/admin/requests/${id}/status`,
    { method: "PATCH", body: payload },
  );
}

export function getAllUsers(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
}) {
  return apiClient<ApiResponse<User[]>>("/admin/users", { params });
}

export function updateUserStatus(id: string, status: string) {
  return apiClient<ApiResponse<User>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
