"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { useAuth } from "../hooks/use-auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.email("Enter a valid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password cannot exceed 128 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerAccount } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <form className="form-stack" onSubmit={handleSubmit((values) => registerAccount(values, redirectTo))}>
      <InputField label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <InputField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <InputField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={16} className="spin" /> : <UserPlus size={16} />}
        Create account
      </Button>
      <div className="auth-links">
        <Link href="/login">Sign in instead</Link>
      </div>
    </form>
  );
}
