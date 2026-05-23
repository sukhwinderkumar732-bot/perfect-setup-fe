export type ApiResponse<TData> = {
  success: boolean;
  data: TData;
  message?: string;
};

export type ApiMessageResponse = {
  success: boolean;
  message: string;
};

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<TData> = {
  success: boolean;
  data: TData[];
  meta: PaginationMeta;
};

export type ListQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};
