import type { CitizenProfile, ResolverProfile } from "./resolver.type";
import type { Department } from "./service.type";
import type { User } from "./user.type";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: File;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface SendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** `POST /auth/login` returns tokens only; the profile comes from `/auth/me`. */
export type LoginResponse = AuthTokens;

/** `POST /auth/register` returns the created user alongside its tokens. */
export interface RegisterResponse extends AuthTokens {
  user: User;
  citizen: CitizenProfile;
}

/**
 * Shape returned by `GET /auth/me`: the user row itself, with the
 * role-specific profile and its department already included.
 */
export type Me = User & {
  citizen: CitizenProfile | null;
  resolver: (ResolverProfile & { department: Department }) | null;
};
