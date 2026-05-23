"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { createUserSchema, updateUserSchema, type CreateUserFormValues, type UpdateUserFormValues } from "../schemas/user-schemas";
import type { User, UserRole } from "../types/user";

type CreateModeProps = {
  mode: "create";
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
};

type UpdateModeProps = {
  mode: "update";
  user: User;
  onSubmit: (values: UpdateUserFormValues) => Promise<void>;
};

type UserFormProps = CreateModeProps | UpdateModeProps;

export function UserForm(props: UserFormProps) {
  const isCreate = props.mode === "create";
  const schema = isCreate ? createUserSchema : updateUserSchema;
  const defaultValues = isCreate
    ? { name: "", email: "", password: "", role: "user" as UserRole }
    : { name: props.user.name, email: props.user.email, role: props.user.role };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form className="panel" onSubmit={handleSubmit((values) => props.onSubmit(values as never))}>
      <div className="panel-body form-stack">
        <InputField label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <InputField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        {isCreate ? (
          <InputField
            label="Temporary password"
            type="password"
            autoComplete="new-password"
            error={(errors as Partial<Record<"password", { message?: string }>>).password?.message}
            {...register("password" as never)}
          />
        ) : null}
        <SelectField label="Role" error={errors.role?.message} {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </SelectField>
      </div>
      <div className="modal-footer">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {isCreate ? "Create user" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
