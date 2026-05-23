import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Admin control center</p>
          </div>
        </div>
        <h1>Sign in</h1>
        <p>Use an administrator account to manage backend resources.</p>
        <LoginForm />
      </section>
    </main>
  );
}
