import { UserRole } from "@/types";

export const abilityMap: Record<UserRole, string[]> = {
  ADMIN: ["user.create", "user.read", "user.update", "user.delete"],
  EMPLOYEE: ["user.read"],
  HR: [],
  MANAGER: [],
};
