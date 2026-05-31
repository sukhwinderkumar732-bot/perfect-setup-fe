import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/query/query-keys";
import type { ListQueryParams } from "@/types/api";
import type { CreateUserInput, UpdateUserInput } from "../types/user";
import { usersApi } from "./users-api";

export const useUsers = (params: ListQueryParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.list(params),
    placeholderData: (previous) => previous,
    enabled: options.enabled,
  });

export const useUser = (id: number, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: (options.enabled ?? true) && Number.isFinite(id) && id > 0,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User created");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Unable to create user")),
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => usersApi.update(id, input),
    onSuccess: async (user) => {
      queryClient.setQueryData(queryKeys.users.detail(id), user);
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User updated");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Unable to update user")),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Unable to delete user")),
  });
};
