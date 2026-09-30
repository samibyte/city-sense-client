import apiClient from "@/lib/apiClient";
import type { ApiResponse, User } from "@/types";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: File;
}

export function updateProfile(payload: UpdateProfilePayload) {
  // Flat multipart fields, matching the register endpoint.
  const formData = new FormData();

  if (payload.name) {
    formData.append("name", payload.name);
  }

  if (payload.phone) {
    formData.append("phone", payload.phone);
  }

  if (payload.address) {
    formData.append("address", payload.address);
  }

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  return apiClient<ApiResponse<User>>("/users/profile", {
    method: "PATCH",
    body: formData,
  });
}
