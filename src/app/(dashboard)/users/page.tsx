import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { UsersTable } from "@/features/users/components/users-table";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Manage administrator and application user accounts." />
      <UsersTable />
    </>
  );
}
