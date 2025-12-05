import api from "@/lib/http";
import type { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getMe = async () => {
    const resp = await api.get("/auth/me");
    const data = resp.data as UserInfo;
    return data;
};

export const useMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ME"],
    queryFn: getMe,
  });

  return {
    data,
    isLoading,
    error,
  };
};
