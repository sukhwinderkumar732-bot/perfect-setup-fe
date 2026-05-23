"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { UserForm } from "@/features/users/components/user-form";
import { useUpdateUser, useUser } from "@/features/users/api/user-queries";
import type { UpdateUserFormValues } from "@/features/users/schemas/user-schemas";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const userQuery = useUser(id);
  const updateUser = useUpdateUser(id);

  const handleSubmit = async (values: UpdateUserFormValues) => {
    await updateUser.mutateAsync(values);
    router.push("/users");
  };

  if (userQuery.isLoading) {
    return (
      <>
        <PageHeader title="Edit user" description="Loading account details." />
        <div className="panel panel-body form-stack">
          <div className="skeleton" style={{ height: 42 }} />
          <div className="skeleton" style={{ height: 42 }} />
          <div className="skeleton" style={{ height: 42 }} />
        </div>
      </>
    );
  }

  if (!userQuery.data) {
    return <EmptyState title="User not found" description="The requested user may have been deleted." />;
  }

  return (
    <>
      <PageHeader title="Edit user" description={`Update profile and authorization details for ${userQuery.data.email}.`} />
      <UserForm mode="update" user={userQuery.data} onSubmit={handleSubmit} />
    </>
  );
}
