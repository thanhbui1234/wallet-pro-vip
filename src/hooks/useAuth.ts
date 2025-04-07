"use client";

import authService from "@/services/AuthServices";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Use a query to check authentication status
  const authQuery = useQuery({
    queryKey: ["auth", "status"],
    queryFn: () => authService.isAuthenticated(),
    // Don't refetch on window focus to avoid unnecessary checks
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Update auth status in cache
      queryClient.setQueryData(["auth", "status"], true);
      queryClient.setQueryData(["user"], data.user);
      router.push("/");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Update auth status in cache
      queryClient.setQueryData(["auth", "status"], false);
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,

    // Use the cached value from the query
    isAuthenticated: () => authQuery.data ?? authService.isAuthenticated(),

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}
