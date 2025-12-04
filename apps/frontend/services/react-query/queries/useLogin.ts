import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const login = async (payload: { email: string; password: string }) => {
  const res = await api.post("/auth/login", payload, {
    withCredentials: true,
  });
  const data = res.data;
  return data as {
    accessExpiresAt: string;
    accessToken: string;
  };
};

export const useLogin = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      login(payload),
  });

  return {
    mutateAsync
  }
};
