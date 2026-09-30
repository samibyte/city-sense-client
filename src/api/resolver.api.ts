import apiClient from "@/lib/apiClient";
import type { ApiResponse, Assignment, ResolverProfile } from "@/types";

export interface ApplyAsResolverPayload {
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  city: string;
  area?: string;
  bio?: string;
}

export function applyAsResolver(
  payload: ApplyAsResolverPayload,
  resume: File,
  additionalFiles: File[] = [],
) {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload));
  formData.append("resume", resume);

  for (const file of additionalFiles) {
    formData.append("additionalFiles", file);
  }

  return apiClient<ApiResponse<unknown>>("/resolver/apply-as-resolver", {
    method: "POST",
    body: formData,
  });
}

export function getApplications(params?: { page?: number; limit?: number }) {
  return apiClient<ApiResponse<ResolverProfile[]>>("/resolver/applications", {
    params,
  });
}

export function getApplicationById(id: string) {
  return apiClient<ApiResponse<ResolverProfile>>(
    `/resolver/applications/${id}`,
  );
}

export function reviewApplication(payload: {
  id: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}) {
  return apiClient<ApiResponse<ResolverProfile>>(
    "/resolver/application-review",
    { method: "PATCH", body: payload },
  );
}

export function getMyAssignments(params?: { page?: number; limit?: number }) {
  return apiClient<ApiResponse<Assignment[]>>("/resolver/assignments", {
    params,
  });
}

export function getAssignmentById(id: string) {
  return apiClient<ApiResponse<Assignment>>(`/resolver/assignments/${id}`);
}

export function acceptAssignment(id: string) {
  return apiClient<ApiResponse<Assignment>>(
    `/resolver/assignments/${id}/accept`,
    { method: "PATCH" },
  );
}

export function rejectAssignment(id: string, reason: string) {
  return apiClient<ApiResponse<Assignment>>(
    `/resolver/assignments/${id}/reject`,
    { method: "PATCH", body: { reason } },
  );
}

export function updateAssignmentStatus(
  id: string,
  payload: { status: string; notes?: string },
) {
  return apiClient<ApiResponse<Assignment>>(
    `/resolver/assignments/${id}/status`,
    { method: "PATCH", body: payload },
  );
}
