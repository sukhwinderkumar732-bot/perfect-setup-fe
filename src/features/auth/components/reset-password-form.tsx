"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { getErrorMessage } from "@/lib/api/api-error";
import { authApi } from "../api/auth-api";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password cannot exceed 128 characters"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const hasValidToken = token.length >= 32;
  const [isComplete, setIsComplete] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!hasValidToken) {
      toast.error("Reset link is missing or invalid");
      return;
    }

    try {
      await authApi.resetPassword({ token, password: values.password });
      setIsComplete(true);
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reset password"));
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
      {isComplete ? <div className="notice notice-success">Your password has been reset. You can sign in now.</div> : null}
      {!hasValidToken ? (
        <div className="notice notice-danger">This reset link is missing or invalid. Please request a new password reset email.</div>
      ) : null}
      <InputField
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isSubmitting || isComplete || !hasValidToken}>
        {isSubmitting ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />}
        Reset password
      </Button>
      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}
