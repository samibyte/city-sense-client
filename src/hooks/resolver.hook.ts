import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ApplyAsResolverPayload,
  acceptAssignment,
  applyAsResolver,
  getApplications,
  getAssignmentById,
  getMyAssignments,
  rejectAssignment,
  reviewApplication,
  updateAssignmentStatus,
} from "@/api";

const resolverKeys = {
  all: ["resolver"] as const,
  applications: ["resolver", "applications"] as const,
  assignments: ["resolver", "assignments"] as const,
};

export function useGetApplications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...resolverKeys.applications, params],
    queryFn: () => getApplications(params),
  });
}

export function useGetMyAssignments(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...resolverKeys.assignments, params],
    queryFn: () => getMyAssignments(params),
  });
}

export function useGetAssignmentById(id: string) {
  return useQuery({
    queryKey: ["resolver", "assignments", "detail", id],
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
  });
}

function useInvalidateResolver() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: resolverKeys.all });
}

export function useApplyAsResolver() {
  return useMutation({
    mutationFn: ({
      payload,
      resume,
      additionalFiles,
    }: {
      payload: ApplyAsResolverPayload;
      resume: File;
      additionalFiles?: File[];
    }) => applyAsResolver(payload, resume, additionalFiles),
  });
}

export function useReviewApplication() {
  const invalidate = useInvalidateResolver();

  return useMutation({
    mutationFn: (payload: {
      id: string;
      status: "APPROVED" | "REJECTED";
      rejectionReason?: string;
    }) => reviewApplication(payload),
    onSuccess: invalidate,
  });
}

export function useAcceptAssignment() {
  const invalidate = useInvalidateResolver();

  return useMutation({
    mutationFn: (id: string) => acceptAssignment(id),
    onSuccess: invalidate,
  });
}

export function useRejectAssignment() {
  const invalidate = useInvalidateResolver();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectAssignment(id, reason),
    onSuccess: invalidate,
  });
}

export function useUpdateAssignmentStatus() {
  const invalidate = useInvalidateResolver();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status: string; notes?: string };
    }) => updateAssignmentStatus(id, payload),
    onSuccess: invalidate,
  });
}
