const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001"),
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Perfect Admin",
} as const;
