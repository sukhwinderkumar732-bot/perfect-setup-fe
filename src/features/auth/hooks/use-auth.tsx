"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { setRefreshHandler } from "@/lib/api/http-client";
import { getErrorMessage } from "@/lib/api/api-error";
import { tokenStore } from "@/lib/api/token-store";
import { queryKeys } from "@/lib/query/query-keys";
import { authApi, type LoginInput, type RegisterInput } from "../api/auth-api";
import type { User } from "@/features/users/types/user";

type AuthContextValue = {
  user: User | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  can: (permission: Permission) => boolean;
  register: (input: RegisterInput, redirectTo?: string) => Promise<void>;
  login: (input: LoginInput, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

type Permission = "users:read" | "users:create" | "users:update" | "users:delete";

const rolePermissions: Record<User["role"], Permission[]> = {
  admin: ["users:read", "users:create", "users:update", "users:delete"],
  user: [],
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const applySession = useCallback((accessToken: string, nextUser: User) => {
    tokenStore.setAccessToken(accessToken);
    setUser(nextUser);
    queryClient.setQueryData(queryKeys.auth.me, nextUser);
  }, [queryClient]);

  const refreshSession = useCallback(async () => {
    try {
      const session = await authApi.refresh();
      applySession(session.accessToken, session.user);
      return session.accessToken;
    } catch {
      tokenStore.clear();
      setUser(null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      return null;
    }
  }, [applySession, queryClient]);

  useEffect(() => {
    setRefreshHandler(refreshSession);
    return () => setRefreshHandler(null);
  }, [refreshSession]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      await refreshSession();
      if (active) {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [refreshSession]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onError: (error) => toast.error(getErrorMessage(error, "Unable to sign in")),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onError: (error) => toast.error(getErrorMessage(error, "Unable to create account")),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      tokenStore.clear();
      setUser(null);
      queryClient.clear();
      if (pathname !== "/login") {
        router.replace("/login");
      }
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: authApi.logoutAll,
    onSettled: () => {
      tokenStore.clear();
      setUser(null);
      queryClient.clear();
      router.replace("/login");
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isBootstrapping,
      isAuthenticated: Boolean(user),
      can: (permission) => (user ? rolePermissions[user.role].includes(permission) : false),
      register: async (input, redirectTo) => {
        const session = await registerMutation.mutateAsync(input);
        applySession(session.accessToken, session.user);
        toast.success("Account created successfully");
        router.replace(redirectTo ?? "/dashboard");
      },
      login: async (input, redirectTo) => {
        const session = await loginMutation.mutateAsync(input);
        applySession(session.accessToken, session.user);
        toast.success("Signed in successfully");
        router.replace(redirectTo ?? "/dashboard");
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      logoutAll: async () => {
        await logoutAllMutation.mutateAsync();
      },
      refreshUser: async () => {
        const response = await authApi.me();
        setUser(response);
        queryClient.setQueryData(queryKeys.auth.me, response);
      },
    }),
    [applySession, isBootstrapping, loginMutation, logoutAllMutation, logoutMutation, queryClient, registerMutation, router, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
