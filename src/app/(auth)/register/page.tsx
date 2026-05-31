import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/register-form";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Create a managed account</p>
          </div>
        </div>
        <h1>Create account</h1>
        <p>Register an application user and start a secure session.</p>
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </section>
    </main>
  );
}
