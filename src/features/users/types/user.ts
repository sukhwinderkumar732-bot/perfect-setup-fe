export const userRoles = ["user", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  role?: UserRole;
};
