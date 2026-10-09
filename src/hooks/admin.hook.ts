import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRequest,
  getAdminStats,
  getAllRequests,
  getAllUsers,
  getAvailableResolvers,
  reassignRequest,
  updateRequestStatus,
  updateUserStatus,
} from "@/api";
import type { RequestParams } from "@/types";

const adminKeys = {
  stats: ["admin", "stats"] as const,
  requests: (params?: RequestParams) => ["admin", "requests", params] as const,
  resolvers: ["admin", "resolvers", "available"] as const,
  users: ["admin", "users"] as const,
};

export function useGetAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: getAdminStats,
  });
}

export function useGetAllRequests(params?: RequestParams) {
  return useQuery({
    queryKey: adminKeys.requests(params),
    queryFn: () => getAllRequests(params),
  });
}

export function useGetAvailableResolvers(params?: {
  departmentId?: string;
  city?: string;
  area?: string;
}) {
  return useQuery({
    queryKey: [...adminKeys.resolvers, params],
    queryFn: () => getAvailableResolvers(params),
  });
}

export function useGetAllUsers(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: [...adminKeys.users, params],
    queryFn: () => getAllUsers(params),
  });
}

function useInvalidateRequests() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
}

export function useAssignRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (payload: {
      requestId: string;
      resolverId: string;
      priority?: string;
    }) => assignRequest(payload),
    onSuccess: invalidate,
  });
}

export function useReassignRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (payload: {
      requestId: string;
      resolverId: string;
      reason?: string;
    }) => reassignRequest(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateRequestStatus() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status: string; notes?: string; priority?: string };
    }) => updateRequestStatus(id, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateUserStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
