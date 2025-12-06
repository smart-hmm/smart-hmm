"use client";

import { abilityMap } from "@/lib/rbac/abilities";
import { RootState } from "@/services/redux/store";
import { createContext, useCallback, useContext } from "react";
import { useSelector } from "react-redux";

type RBACContextType = {
  can: (perm: string) => boolean;
};

const RBACContext = createContext<RBACContextType | null>(null);

export default function RBACProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user);
  const can = useCallback(
    (perm: string) => {
      if (!user || !user.userInfo) return false;
      const role = user.userInfo.role;
      return abilityMap[role]?.includes(perm) ?? false;
    },
    [user]
  );

  return (
    <RBACContext.Provider value={{ can }}>{children}</RBACContext.Provider>
  );
}

export function useRBAC() {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error("useRBAC must be used inside RBACProvider");
  return ctx;
}
