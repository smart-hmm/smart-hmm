"use client";

import { useMe } from "@/services/react-query/queries/use-me";
import {
  setSelectedTenant,
  setTenants,
} from "@/services/redux/slices/tenants-slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useMe();
  const [isChecking, setChecking] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const recentTenantId =
    typeof window !== "undefined"
      ? localStorage.getItem("recent_tenant_id")
      : null;

  const state = useMemo(() => {
    if (isLoading) return { type: "loading" as const };

    if (error || !data) {
      return { type: "unauthenticated" as const };
    }

    if (!data.tenants || data.tenants.length === 0) {
      return { type: "no-tenant" as const };
    }

    const recentTenant = recentTenantId
      ? data.tenants.find((t) => t.id === recentTenantId)
      : null;

    return {
      type: "authenticated" as const,
      tenants: data.tenants,
      recentTenant,
    };
  }, [isLoading, error, data, recentTenantId]);

  useEffect(() => {
    if (state.type === "loading") return;

    if (state.type === "unauthenticated") {
      if (pathname !== "/login") {
        router.replace("/login");
      }
      return;
    }

    if (state.type === "no-tenant") {
      router.replace("/onboarding");
      return;
    }

    dispatch(setTenants({ tenants: state.tenants }));

    if (state.recentTenant) {
      dispatch(setSelectedTenant({ tenant: state.recentTenant }));

      if (pathname === "/" || pathname === "/login") {
        router.replace(`/${state.recentTenant.workspaceSlug}`);
      }

      return;
    }

    if(pathname === "/onboarding") return;
    
    router.replace("/select-tenant");
  }, [state, pathname, router, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setChecking(false), 50);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (isChecking) return null;
  return children;
}
