import api from "@/lib/http";
import type { EmployeeInfo, UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import type { TenantInfo } from "@/types/tenant";

const getMe = async () => {
  const resp = await api.get("/auth/me");
  const data = resp.data as {
    user: UserInfo;
    employee: EmployeeInfo;
    tenants: TenantInfo[] | null;
  };
  return data;
};

export const useMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_ME],
    queryFn: getMe,
  });

  return {
    data,
    isLoading,
    error,
  };
};
