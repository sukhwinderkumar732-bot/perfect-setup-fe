"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/api/api-error";
import { authApi } from "../api/auth-api";

type VerificationState =
  | { status: "loading"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerificationState>({
    status: token ? "loading" : "error",
    message: token ? "Verifying your email address." : "Verification token is missing.",
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        if (active) {
          setState({ status: "success", message: response.message });
        }
      } catch (error) {
        if (active) {
          setState({ status: "error", message: getErrorMessage(error, "Unable to verify email") });
        }
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, [token]);

  const Icon = state.status === "loading" ? Loader2 : state.status === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="form-stack">
      <div className={`notice ${state.status === "success" ? "notice-success" : state.status === "error" ? "notice-danger" : ""}`}>
        <div className="actions-row">
          <Icon size={18} className={state.status === "loading" ? "spin" : undefined} />
          <span>{state.message}</span>
        </div>
      </div>
      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </div>
  );
}
