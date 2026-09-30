export interface CreateRequestPayload {
  type: "COMPLAINT" | "SERVICE_REQUEST";
  title: string;
  description: string;
  categoryId: string;
  serviceId?: string;
  location: {
    address: string;
    area: string;
    city: string;
    latitude?: string;
    longitude?: string;
  };
  attachments?: File[];
}

export interface RequestParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  type?: string;
  priority?: string;
  categoryId?: string;
  departmentId?: string;
  requestNumber?: string;
}

export interface UpdateRequestStatusPayload {
  status: string;
  notes?: string;
  priority?: string;
}

export interface RequestNotePayload {
  notes: string;
}

export interface AssignRequestPayload {
  resolverId: string;
}
