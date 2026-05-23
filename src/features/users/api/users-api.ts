import { httpClient } from "@/lib/api/http-client";
import type { ApiResponse, ListQueryParams, PaginatedResponse } from "@/types/api";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user";

const toSearchParams = (params: ListQueryParams) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const usersApi = {
  list: (params: ListQueryParams) => httpClient.get<PaginatedResponse<User>>(`/api/users${toSearchParams(params)}`),
  getById: async (id: number) => (await httpClient.get<ApiResponse<User>>(`/api/users/${id}`)).data,
  create: async (input: CreateUserInput) => (await httpClient.post<ApiResponse<User>>("/api/users", input)).data,
  update: async (id: number, input: UpdateUserInput) =>
    (await httpClient.put<ApiResponse<User>>(`/api/users/${id}`, input)).data,
  delete: (id: number) => httpClient.delete<void>(`/api/users/${id}`),
};
