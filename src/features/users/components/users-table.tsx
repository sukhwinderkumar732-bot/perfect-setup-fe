"use client";

import Link from "next/link";
import { Edit, Eye, MailCheck, Plus, Search, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InputField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import type { User } from "../types/user";
import { useDeleteUser, useUsers } from "../api/user-queries";

const formatDate = (value: string | null) => (value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "Never");

export function UsersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const [searchDraft, setSearchDraft] = useState(search);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<User | null>(null);
  const usersQuery = useUsers({ page, limit: 10, search: search || undefined });
  const deleteUser = useDeleteUser();

  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);
  const meta = usersQuery.data?.meta;

  const updateParams = (next: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`/users?${params.toString()}`);
  };

  const rows = useMemo(
    () =>
      users.map((user) => (
        <tr key={user.id}>
          <td>
            <strong>{user.name}</strong>
            <div className="muted">ID {user.id}</div>
          </td>
          <td>{user.email}</td>
          <td>
            <StatusBadge tone={user.role === "admin" ? "admin" : "user"}>{user.role}</StatusBadge>
          </td>
          <td>
            <StatusBadge tone={user.emailVerifiedAt ? "success" : "warning"}>
              <MailCheck size={13} /> {user.emailVerifiedAt ? "Verified" : "Pending"}
            </StatusBadge>
          </td>
          <td>{formatDate(user.createdAt)}</td>
          <td>
            <div className="actions-row">
              <Button type="button" variant="ghost" iconOnly aria-label={`View ${user.name}`} onClick={() => setViewingUser(user)}>
                <Eye size={17} />
              </Button>
              <Link className="button button-secondary button-icon" aria-label={`Edit ${user.name}`} href={`/users/${user.id}/edit`}>
                <Edit size={17} />
              </Link>
              <Button type="button" variant="ghost" iconOnly aria-label={`Delete ${user.name}`} onClick={() => setDeleteCandidate(user)}>
                <Trash2 size={17} />
              </Button>
            </div>
          </td>
        </tr>
      )),
    [users],
  );

  return (
    <section className="panel">
      <header className="panel-header">
        <form
          className="actions-row"
          onSubmit={(event) => {
            event.preventDefault();
            updateParams({ search: searchDraft.trim() || undefined, page: 1 });
          }}
        >
          <div style={{ width: 280 }}>
            <InputField
              label="Search users"
              value={searchDraft}
              placeholder="Name or email"
              onChange={(event) => setSearchDraft(event.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            <Search size={16} /> Search
          </Button>
        </form>
        <Link className="button button-primary" href="/users/new">
          <Plus size={16} /> New user
        </Link>
      </header>

      {usersQuery.isLoading ? (
        <div className="panel-body form-stack">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton" style={{ height: 42 }} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Create the first admin user or adjust the current filters." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Email status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}

      {meta ? (
        <Pagination
          page={meta.page}
          total={meta.total}
          totalPages={meta.totalPages}
          isFetching={usersQuery.isFetching}
          onPageChange={(nextPage) => updateParams({ page: nextPage })}
        />
      ) : null}

      <Modal
        open={Boolean(viewingUser)}
        title="User details"
        onClose={() => setViewingUser(null)}
        footer={<Button type="button" variant="secondary" onClick={() => setViewingUser(null)}>Close</Button>}
      >
        {viewingUser ? (
          <div className="form-stack">
            <div><strong>Name</strong><div className="muted">{viewingUser.name}</div></div>
            <div><strong>Email</strong><div className="muted">{viewingUser.email}</div></div>
            <div><strong>Role</strong><div><StatusBadge tone={viewingUser.role === "admin" ? "admin" : "user"}>{viewingUser.role}</StatusBadge></div></div>
            <div><strong>Created</strong><div className="muted">{formatDate(viewingUser.createdAt)}</div></div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteCandidate)}
        title="Delete user"
        onClose={() => setDeleteCandidate(null)}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setDeleteCandidate(null)}>Cancel</Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteUser.isPending}
              onClick={async () => {
                if (!deleteCandidate) return;
                await deleteUser.mutateAsync(deleteCandidate.id);
                setDeleteCandidate(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="muted">This permanently removes {deleteCandidate?.email}. This action cannot be undone.</p>
      </Modal>
    </section>
  );
}
