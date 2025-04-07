"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated() && !isPublicRoute) {
      // User is not authenticated and trying to access a protected route
      router.push("/login");
    } else if (isAuthenticated() && isPublicRoute && pathname !== "/") {
      router.push("/");
    }

    setIsChecking(false);
  }, [pathname, router, isAuthenticated]);

  // Show nothing while checking authentication status
  if (isChecking) {
    return "loadding...";
  }

  return <>{children}</>;
}
