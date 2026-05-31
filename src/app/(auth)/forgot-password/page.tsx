import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Account recovery</p>
          </div>
        </div>
        <h1>Reset access</h1>
        <p>Request a password reset link for an existing account.</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
