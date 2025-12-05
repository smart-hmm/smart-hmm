import api from "@/lib/http";
import type { AuthInfo } from "@/types";
import { useMutation } from "@tanstack/react-query";

const login = async (payload: { email: string; password: string }) => {
  const res = await api.post("/auth/login", payload, {
    withCredentials: true,
  });
  const data = res.data;

  return data as AuthInfo
};

export const useLogin = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      login(payload),
  });

  return {
    mutateAsync,
    isPending,
  };
};
