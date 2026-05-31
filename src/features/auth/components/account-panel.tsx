"use client";

import { KeyRound, LogOut, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/api/api-error";
import { authApi } from "../api/auth-api";
import { useAuth } from "../hooks/use-auth";

const formatDateTime = (value: string | null) =>
  value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Never";

export function AccountPanel() {
  const { user, logoutAll, refreshUser } = useAuth();

  const requestVerification = async () => {
    try {
      const response = await authApi.requestEmailVerification();
      await refreshUser();
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to request verification email"));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="form-stack">
      <section className="panel">
        <header className="panel-header">
          <div className="actions-row">
            <ShieldCheck size={18} />
            <strong>Profile</strong>
          </div>
          <StatusBadge tone={user.role === "admin" ? "admin" : "user"}>{user.role}</StatusBadge>
        </header>
        <div className="panel-body detail-grid">
          <div>
            <strong>Name</strong>
            <div className="muted">{user.name}</div>
          </div>
          <div>
            <strong>Email</strong>
            <div className="muted">{user.email}</div>
          </div>
          <div>
            <strong>Email status</strong>
            <div>
              <StatusBadge tone={user.emailVerifiedAt ? "success" : "warning"}>
                <MailCheck size={13} /> {user.emailVerifiedAt ? "Verified" : "Pending"}
              </StatusBadge>
            </div>
          </div>
          <div>
            <strong>Password changed</strong>
            <div className="muted">{formatDateTime(user.passwordChangedAt)}</div>
          </div>
          <div>
            <strong>Created</strong>
            <div className="muted">{formatDateTime(user.createdAt)}</div>
          </div>
          <div>
            <strong>Updated</strong>
            <div className="muted">{formatDateTime(user.updatedAt)}</div>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div className="actions-row">
            <KeyRound size={18} />
            <strong>Security</strong>
          </div>
        </header>
        <div className="panel-body actions-row">
          <Button type="button" variant="secondary" onClick={() => void requestVerification()} disabled={Boolean(user.emailVerifiedAt)}>
            <MailCheck size={16} />
            Request verification email
          </Button>
          <Button type="button" variant="danger" onClick={() => void logoutAll()}>
            <LogOut size={16} />
            Logout all sessions
          </Button>
        </div>
      </section>
    </div>
  );
}
