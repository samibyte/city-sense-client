import type { FileAttachment } from "./file.type";
import type { Department } from "./service.type";

export type ResolverVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ResolverProfile {
  id: string;
  bio: string | null;
  resume: string | null;
  resumePublicId: string | null;
  additionalFiles: FileAttachment[] | null;
  city: string;
  area: string | null;
  maxConcurrentAssignments: number;
  verificationStatus: ResolverVerificationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  departmentId: string;
}

export interface ResolverProfileWithDepartment extends ResolverProfile {
  department: Department;
}

export interface CitizenProfile {
  id: string;
  address: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
