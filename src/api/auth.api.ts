import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  LoginResponse,
  Me,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  SendOtpPayload,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegisterPayload) {
  // This endpoint takes flat multipart fields, not a `data` JSON blob:
  // multer populates req.body, which is parsed directly by the zod schema.
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);

  if (payload.phone) {
    formData.append("phone", payload.phone);
  }

  if (payload.address) {
    formData.append("address", payload.address);
  }

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  return apiClient<ApiResponse<RegisterResponse>>("/auth/register", {
    method: "POST",
    body: formData,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<unknown>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function sendVerificationOtp(payload: SendOtpPayload) {
  return apiClient<ApiResponse<unknown>>("/auth/send-verification-otp", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<unknown>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<unknown>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function googleOAuth(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login/google", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<Me>>("/auth/me");
}

export type { AuthTokens };
