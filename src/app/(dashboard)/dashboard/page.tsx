"use client";

import Link from "next/link";
import { MailCheck, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useUsers } from "@/features/users/api/user-queries";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useUsers({ page: 1, limit: 5 });

  const verified = data?.data.filter((item) => item.emailVerifiedAt).length ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational overview for the backend administration surface."
        actions={
          <Link className="button button-primary" href="/users/new">
            <Plus size={16} /> New user
          </Link>
        }
      />

      <section className="stats-grid" aria-label="User statistics">
        <article className="panel stat">
          <div className="stat-label">Signed in as</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {user?.name}
          </div>
        </article>
        <article className="panel stat">
          <div className="stat-label">Users</div>
          <div className="stat-value">{isLoading ? "..." : data?.meta.total ?? 0}</div>
        </article>
        <article className="panel stat">
          <div className="stat-label">Verified on page</div>
          <div className="stat-value">{isLoading ? "..." : verified}</div>
        </article>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div className="actions-row">
            <Users size={18} />
            <strong>Recent users</strong>
          </div>
          <Link href="/users" className="muted">
            View all
          </Link>
        </header>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <StatusBadge tone={item.role === "admin" ? "admin" : "user"}>{item.role}</StatusBadge>
                  </td>
                  <td>
                    <StatusBadge tone={item.emailVerifiedAt ? "success" : "warning"}>
                      <MailCheck size={13} /> {item.emailVerifiedAt ? "Verified" : "Pending"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
