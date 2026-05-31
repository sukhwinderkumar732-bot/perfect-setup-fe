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
  token: z.string().min(32, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password cannot exceed 128 characters"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [isComplete, setIsComplete] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
      password: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await authApi.resetPassword(values);
      setIsComplete(true);
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reset password"));
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
      {isComplete ? <div className="notice notice-success">Your password has been reset. You can sign in now.</div> : null}
      <InputField label="Reset token" autoComplete="one-time-code" error={errors.token?.message} {...register("token")} />
      <InputField
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isSubmitting || isComplete}>
        {isSubmitting ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />}
        Reset password
      </Button>
      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}
