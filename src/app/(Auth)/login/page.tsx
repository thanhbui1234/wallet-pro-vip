"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "username  is requited"),
  password: z.string().min(2, "password is requited"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      await login(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "oklch(.967 .003 264.542)" }}
    >
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Ngăn chặn hành vi mặc định của form
              handleSubmit(onSubmit)(e);
            }}
          >
            <div className="mb-4">
              <Label className="pb-3" htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label className="pb-3" htmlFor="password">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {(errorMessage || loginError) && (
              <p className="text-red-500 text-sm mb-4">
                {errorMessage ||
                  (loginError && loginError.message) ||
                  "Login failed. Please try again."}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
