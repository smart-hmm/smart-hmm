"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Plus, ArrowRight, Clock } from "lucide-react";
import { TenantInfo } from "@/types/tenant";
import { useMe } from "@/services/react-query/queries/use-me";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/services/redux/store";
import { setSelectedTenant } from "@/services/redux/slices/tenants-slice";

/* ---------------- Role Badge ---------------- */
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    OWNER: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
    ADMIN: "bg-[var(--color-info)]/15 text-[var(--color-info)]",
    MEMBER: "bg-[var(--color-muted)] text-[var(--color-foreground)]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[role] ?? styles.MEMBER
      }`}
    >
      {role}
    </span>
  );
}

export default function SelectTenantPage() {
  const router = useRouter();
  const dispath = useDispatch();
  const { tenants } = useSelector((state: RootState) => state.tenants);

  const sortedTenants = useMemo(() => {
    if (!localStorage.getItem("recent_tenant_id")) return tenants;

    return [
      ...tenants.filter(
        (t) => t.id === localStorage.getItem("recent_tenant_id")
      ),
      ...tenants.filter(
        (t) => t.id !== localStorage.getItem("recent_tenant_id")
      ),
    ];
  }, [tenants]);

  const selectTenant = (tenant: TenantInfo) => {
    localStorage.setItem("recent_tenant_id", tenant.id);
    dispath(setSelectedTenant({ tenant }));
    router.push(`/${tenant.workspaceSlug}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Choose your workspace
          </h1>
          <p className="mt-2 text-sm text-foreground">
            Select a tenant to continue to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sortedTenants.map((tenant) => {
            const isRecent =
              tenant.id === localStorage.getItem("recent_tenant_id");

            return (
              <motion.button
                key={tenant.id}
                onClick={() => selectTenant(tenant)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl border border-[var(--color-muted)] bg-[var(--color-surface)] p-6 text-left
                    hover:border-[var(--color-primary)]
                    hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Building2 className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{tenant.name}</h3>

                      {isRecent && (
                        <span className="flex items-center gap-1 text-xs text-[var(--color-primary)]">
                          <Clock className="h-3 w-3" />
                          Recent
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <RoleBadge role={"admin"} />
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 opacity-0 transition group-hover:opacity-100 text-[var(--color-primary)]" />
                </div>
              </motion.button>
            );
          })}

          {/* Create new tenant */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/onboarding")}
            className="rounded-2xl border-2 border-dashed border-[var(--color-muted)] bg-transparent p-6 text-left
                hover:border-[var(--color-primary)]
                hover:bg-[var(--color-surface)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                <Plus className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-lg font-medium">Create new workspace</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Start a new organization
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
