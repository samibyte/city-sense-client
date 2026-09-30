export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  /**
   * Only paginated endpoints return this. The API always serializes the key,
   * but it is `undefined` for single-resource and unpaginated list endpoints.
   */
  meta?: Meta;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Error body returned by the API for every non-2xx response. */
export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string;
  errors: string[];
}
