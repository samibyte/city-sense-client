import apiClient from "@/lib/apiClient";
import type { ApiResponse, Department } from "@/types";

export function getAllDepartments() {
  return apiClient<ApiResponse<Department[]>>("/departments");
}

export function getDepartmentById(id: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`);
}
