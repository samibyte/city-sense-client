export interface Department {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  departmentId: string;
}

export type ServiceType = "FREE" | "PAID";

export interface Service {
  id: string;
  name: string;
  description: string;
  /** Prisma Decimal, serialized as a string by the API. */
  price: string;
  estimatedDuration: number | null;
  isPaid: boolean;
  serviceType: ServiceType;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  departmentId: string;
  categoryId: string;
}

export interface ServiceWithRelations extends Service {
  department: Department;
  category: ServiceCategory;
}
