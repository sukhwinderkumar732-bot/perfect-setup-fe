"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { getErrorMessage } from "@/lib/api/api-error";
import { authApi } from "../api/auth-api";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address").toLowerCase(),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await authApi.forgotPassword(values);
      setMessage(response.message);
      toast.success("Reset request submitted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to request password reset"));
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
      {message ? <div className="notice notice-success">{message}</div> : null}
      <InputField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
        Send reset link
      </Button>
      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}
