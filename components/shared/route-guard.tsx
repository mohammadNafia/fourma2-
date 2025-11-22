"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMockAuth } from "./mock-auth-provider";
import { FullPageLoader } from "./loading";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function RouteGuard({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, userRole } = useMockAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (requireAdmin && (!isAuthenticated || userRole !== "admin")) {
      router.push("/auth/login");
      return;
    }

    setLoading(false);
  }, [isAuthenticated, userRole, requireAuth, requireAdmin, router]);

  if (loading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

