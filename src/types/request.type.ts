import type { FileAttachment } from "./file.type";
import type { Payment } from "./payment.type";
import type { CitizenProfile } from "./resolver.type";
import type { Service, ServiceCategory } from "./service.type";
import type { User } from "./user.type";

export type RequestType = "COMPLAINT" | "SERVICE_REQUEST";

export type RequestStatus =
  | "PENDING"
  | "SUBMITTED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "RESOLVED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REASSIGNED"
  | "CANCELLED";

export interface Location {
  id: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  area: string;
  city: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  type: RequestType;
  title: string;
  description: string;
  requestAttachment: FileAttachment[] | null;
  status: RequestStatus;
  priority: Priority | null;
  slaDeadline: string | null;
  resolvedAt: string | null;
  completedAt: string | null;
  assignedResolverId: string | null;
  assignedByAdminId: string | null;
  assignedAt: string | null;
  rejectReason: string | null;
  rejectionCount: number;
  autoAssigned: boolean;
  createdAt: string;
  updatedAt: string;
  citizenId: string;
  serviceId: string | null;
  categoryId: string;
  locationId: string;
}

export interface RequestWithRelations extends ServiceRequest {
  citizen: CitizenProfile & { user: User };
  service: Service | null;
  category: ServiceCategory;
  location: Location;
  assignments?: Assignment[];
  statusHistory?: RequestStatusHistory[];
  payment?: Payment | null;
  feedback?: Feedback | null;
}

export interface Assignment {
  id: string;
  status: AssignmentStatus;
  priority: Priority | null;
  assignedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectedReason: string | null;
  completedAt: string | null;
  previousAssignmentId: string | null;
  reassignedByAdminId: string | null;
  assignedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  requestId: string;
  resolverId: string;
}

export interface RequestStatusHistory {
  id: string;
  status: RequestStatus;
  previousStatus: RequestStatus | null;
  notes: string | null;
  createdAt: string;
  requestId: string;
  changedByUserId: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  requestId: string;
  citizenId: string;
  resolverId: string;
}
