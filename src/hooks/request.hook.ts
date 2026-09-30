import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelRequest,
  confirmCompletion,
  createRequest,
  getMyRequests,
  getRequestById,
  giveFeedback,
} from "@/api";
import type { CreateRequestPayload, RequestParams } from "@/types";

const requestKeys = {
  all: ["requests"] as const,
  list: (params?: RequestParams) => ["requests", "list", params] as const,
  detail: (id: string) => ["requests", "detail", id] as const,
};

export function useGetMyRequests(params?: RequestParams) {
  return useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => getMyRequests(params),
  });
}

export function useGetRequestById(id: string) {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => getRequestById(id),
    enabled: Boolean(id),
  });
}

function useInvalidateRequests() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: requestKeys.all });
}

export function useCreateRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
    onSuccess: invalidate,
  });
}

export function useCancelRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (id: string) => cancelRequest(id),
    onSuccess: invalidate,
  });
}

export function useConfirmCompletion() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (id: string) => confirmCompletion(id),
    onSuccess: invalidate,
  });
}

export function useGiveFeedback() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { rating: number; comment?: string };
    }) => giveFeedback(id, payload),
    onSuccess: invalidate,
  });
}
