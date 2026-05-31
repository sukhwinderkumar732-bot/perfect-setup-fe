import { httpClient } from "@/lib/api/http-client";
import type { ApiMessageResponse, ApiResponse } from "@/types/api";
import type { User } from "@/features/users/types/user";

export type AuthSession = {
  accessToken: string;
  user: User;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export const authApi = {
  register: async (input: RegisterInput) =>
    (await httpClient.post<ApiResponse<AuthSession>>("/api/auth/register", input, { auth: false })).data,
  login: async (input: LoginInput) =>
    (await httpClient.post<ApiResponse<AuthSession>>("/api/auth/login", input, { auth: false })).data,
  refresh: async () =>
    (await httpClient.post<ApiResponse<AuthSession>>("/api/auth/refresh", undefined, { auth: false })).data,
  me: async () => (await httpClient.get<ApiResponse<User>>("/api/auth/me")).data,
  logout: async () => httpClient.post<void>("/api/auth/logout"),
  logoutAll: async () => httpClient.post<void>("/api/auth/logout-all"),
  requestEmailVerification: async () =>
    httpClient.post<ApiMessageResponse>("/api/auth/verify-email/request"),
  verifyEmail: async (token: string) =>
    httpClient.get<ApiMessageResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, { auth: false }),
  forgotPassword: async (input: ForgotPasswordInput) =>
    httpClient.post<ApiMessageResponse>("/api/auth/forgot-password", input, { auth: false }),
  resetPassword: async (input: ResetPasswordInput) =>
    httpClient.post<void>("/api/auth/reset-password", input, { auth: false }),
};
