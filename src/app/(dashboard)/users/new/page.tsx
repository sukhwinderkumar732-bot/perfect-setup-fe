"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { UserForm } from "@/features/users/components/user-form";
import { useCreateUser } from "@/features/users/api/user-queries";
import type { CreateUserFormValues } from "@/features/users/schemas/user-schemas";

export default function NewUserPage() {
  const router = useRouter();
  const { can } = useAuth();
  const createUser = useCreateUser();

  const handleSubmit = async (values: CreateUserFormValues) => {
    await createUser.mutateAsync(values);
    router.push("/users");
  };

  if (!can("users:create")) {
    return <EmptyState title="Access restricted" description="Creating users requires an administrator account." />;
  }

  return (
    <>
      <PageHeader title="Create user" description="Add a backend account with the correct role from the start." />
      <UserForm mode="create" onSubmit={handleSubmit} />
    </>
  );
}
