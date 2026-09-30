export type UserRole = "ADMIN" | "RESOLVER" | "CITIZEN";

export type UserStatus = "ACTIVE" | "BANNED" | "DELETED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileUrl: string | null;
  profilePublicId: string | null;
  googleId: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
