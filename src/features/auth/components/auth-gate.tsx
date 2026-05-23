"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isBootstrapping, pathname, router]);

  if (isBootstrapping || !isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="actions-row">
          <Loader2 size={18} className="spin" />
          <span className="muted">Preparing your workspace</span>
        </div>
      </div>
    );
  }

  return children;
}
