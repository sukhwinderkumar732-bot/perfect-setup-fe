import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AccountPanel } from "@/features/auth/components/account-panel";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Account" description="Review profile, email verification, and active session controls." />
      <AccountPanel />
    </>
  );
}
