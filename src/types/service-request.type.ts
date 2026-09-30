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
  searchTerm?: string;
  departmentId?: string;
  categoryId?: string;
  isPaid?: boolean;
}

export interface AllServiceParams extends ServiceParams {
  status?: string;
}
