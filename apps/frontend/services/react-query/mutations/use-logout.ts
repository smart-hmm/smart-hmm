import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const logout = async () => {
  await api.post("/auth/logout");
};

export const useLogout = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: logout,
  });

  return {
    mutateAsync,
    isPending,
    error,
  };
};
