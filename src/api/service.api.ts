import apiClient from "@/lib/apiClient";
import type {
  AllServiceParams,
  ApiResponse,
  CreateCategoryPayload,
  CreateServiceRequestPayload,
  Service,
  ServiceCategory,
  ServiceParams,
  ServiceWithRelations,
} from "@/types";

export function getAllServices(params?: AllServiceParams) {
  return apiClient<ApiResponse<ServiceWithRelations[]>>("/services", {
    params,
  });
}

export function getServiceById(id: string) {
  return apiClient<ApiResponse<ServiceWithRelations>>(`/services/${id}`);
}

export function getAllCategories() {
  return apiClient<ApiResponse<ServiceCategory[]>>("/services/categories");
}

export function getCategoryById(id: string) {
  return apiClient<ApiResponse<ServiceCategory>>(`/services/categories/${id}`);
}

export function createService(payload: CreateServiceRequestPayload) {
  return apiClient<ApiResponse<Service>>("/services", {
    method: "POST",
    body: payload,
  });
}

export function updateService(
  id: string,
  payload: Partial<CreateServiceRequestPayload>,
) {
  return apiClient<ApiResponse<Service>>(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteService(id: string) {
  return apiClient<ApiResponse<null>>(`/services/${id}`, { method: "DELETE" });
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<ServiceCategory>>("/services/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(
  id: string,
  payload: Partial<CreateCategoryPayload>,
) {
  return apiClient<ApiResponse<ServiceCategory>>(`/services/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(id: string) {
  return apiClient<ApiResponse<null>>(`/services/categories/${id}`, {
    method: "DELETE",
  });
}

export type { ServiceParams };
