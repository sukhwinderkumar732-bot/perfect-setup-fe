"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { UserForm } from "@/features/users/components/user-form";
import { useCreateUser } from "@/features/users/api/user-queries";
import type { CreateUserFormValues } from "@/features/users/schemas/user-schemas";

export default function NewUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const handleSubmit = async (values: CreateUserFormValues) => {
    await createUser.mutateAsync(values);
    router.push("/users");
  };

  return (
    <>
      <PageHeader title="Create user" description="Add a backend account with the correct role from the start." />
      <UserForm mode="create" onSubmit={handleSubmit} />
    </>
  );
}
