"use client";
import BlankLayout from "@/components/blank-layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "./ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import UserLayout from "./user-layout";
import { usePathname } from "next/navigation";
import { Loader2, Route } from "lucide-react";
import RouteProgress from "./route-progress";

export default function ClientLayoutSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 10,
          },
        },
      })
  );
  const freePaths = ["/auth/login", "/auth/register", "/404", "/401"];

  const isFreePath = freePaths?.includes(pathName?.length > 0 ? pathName : "/");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouteProgress />
        {isFreePath ? (
          <BlankLayout>{children}</BlankLayout>
        ) : (
          <UserLayout>{children}</UserLayout>
        )}
        <Toaster closeButton position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
