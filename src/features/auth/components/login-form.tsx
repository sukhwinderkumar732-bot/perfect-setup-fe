"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { useAuth } from "../hooks/use-auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "change-me-admin-password",
    },
  });

  return (
    <form className="form-stack" onSubmit={handleSubmit(login)}>
      <InputField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <InputField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />}
        Sign in
      </Button>
    </form>
  );
}
