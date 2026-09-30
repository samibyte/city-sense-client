import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateRequestPayload,
  Feedback,
  RequestParams,
  RequestWithRelations,
} from "@/types";

export function createRequest(payload: CreateRequestPayload) {
  // This endpoint accepts a `data` JSON blob alongside the files, which is the
  // only way to express the nested `location` object over multipart.
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload));

  for (const file of payload.attachments ?? []) {
    formData.append("attachments", file);
  }

  return apiClient<ApiResponse<RequestWithRelations>>("/requests", {
    method: "POST",
    body: formData,
  });
}

export function getMyRequests(params?: RequestParams) {
  return apiClient<ApiResponse<RequestWithRelations[]>>(
    "/requests/my-requests",
    {
      params,
    },
  );
}

export function getRequestById(id: string) {
  return apiClient<ApiResponse<RequestWithRelations>>(`/requests/${id}`);
}

export function cancelRequest(id: string) {
  return apiClient<ApiResponse<RequestWithRelations>>(
    `/requests/${id}/cancel`,
    {
      method: "PATCH",
    },
  );
}

export function confirmCompletion(id: string) {
  return apiClient<ApiResponse<RequestWithRelations>>(
    `/requests/${id}/confirm`,
    {
      method: "PATCH",
    },
  );
}

export function giveFeedback(
  id: string,
  payload: { rating: number; comment?: string },
) {
  return apiClient<ApiResponse<Feedback>>(`/requests/${id}/feedback`, {
    method: "POST",
    body: payload,
  });
}
