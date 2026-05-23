import type { ReactNode } from "react";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { DashboardShell } from "@/features/auth/components/dashboard-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <DashboardShell>{children}</DashboardShell>
    </AuthGate>
  );
}
