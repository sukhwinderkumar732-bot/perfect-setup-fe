import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Choose a new password</p>
          </div>
        </div>
        <h1>Reset password</h1>
        <p>Choose a new password for your account.</p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
