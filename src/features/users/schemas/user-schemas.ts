import { z } from "zod";
import { userRoles } from "../types/user";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.email("Enter a valid email address").toLowerCase(),
  password: z.string().min(12, "Password must be at least 12 characters").max(128, "Password cannot exceed 128 characters"),
  role: z.enum(userRoles),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.email("Enter a valid email address").toLowerCase(),
  role: z.enum(userRoles),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
