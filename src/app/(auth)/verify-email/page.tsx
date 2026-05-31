import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailPanel } from "@/features/auth/components/verify-email-panel";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Email verification</p>
          </div>
        </div>
        <h1>Verify email</h1>
        <p>Confirm the email address attached to your account.</p>
        <Suspense fallback={null}>
          <VerifyEmailPanel />
        </Suspense>
      </section>
    </main>
  );
}
