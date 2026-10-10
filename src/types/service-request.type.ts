export interface CreateServiceRequestPayload {
  name: string;
  description: string;
  price: number;
  estimatedDuration?: number;
  isPaid?: boolean;
  departmentId: string;
  categoryId: string;
  image?: File;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  departmentId: string;
  image?: File;
}

export interface ServiceParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  categoryId?: string;
  serviceType?: "FREE" | "PAID";
}

export type AllServiceParams = ServiceParams;
