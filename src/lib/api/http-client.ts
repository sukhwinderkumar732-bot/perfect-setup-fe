import { env } from "@/lib/config/env";
import type { ApiErrorPayload } from "@/types/api";
import { ApiError } from "./api-error";
import { tokenStore } from "./token-store";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

type RefreshHandler = () => Promise<string | null>;

let refreshHandler: RefreshHandler | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setRefreshHandler = (handler: RefreshHandler | null) => {
  refreshHandler = handler;
};

const isFormData = (body: unknown): body is FormData => typeof FormData !== "undefined" && body instanceof FormData;

const buildHeaders = (options: RequestOptions) => {
  const headers = new Headers(options.headers);

  if (!isFormData(options.body) && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = tokenStore.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
};

const parseResponse = async <TData>(response: Response): Promise<TData> => {
  if (response.status === 204) {
    return undefined as TData;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as TData;
  }

  return (await response.text()) as TData;
};

const normalizeError = async (response: Response) => {
  const payload = await parseResponse<ApiErrorPayload | string>(response).catch(() => undefined);
  const message =
    typeof payload === "object" && payload?.message
      ? payload.message
      : typeof payload === "string" && payload.length > 0
        ? payload
        : `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, typeof payload === "object" ? payload : undefined);
};

const request = async <TData>(path: string, options: RequestOptions = {}, retry = true): Promise<TData> => {
  const body = isFormData(options.body)
    ? options.body
    : options.body === undefined
      ? undefined
      : JSON.stringify(options.body);

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    body,
    credentials: "include",
    headers: buildHeaders(options),
  });

  if (response.status === 401 && retry && options.auth !== false && refreshHandler) {
    refreshPromise ??= refreshHandler().finally(() => {
      refreshPromise = null;
    });

    const refreshedToken = await refreshPromise;
    if (refreshedToken) {
      return request<TData>(path, options, false);
    }
  }

  if (!response.ok) {
    throw await normalizeError(response);
  }

  return parseResponse<TData>(response);
};

export const httpClient = {
  get: <TData>(path: string, options?: RequestOptions) => request<TData>(path, { ...options, method: "GET" }),
  post: <TData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "POST", body }),
  put: <TData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "PUT", body }),
  delete: <TData>(path: string, options?: RequestOptions) => request<TData>(path, { ...options, method: "DELETE" }),
};
