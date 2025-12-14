import api from "@/lib/http";
import { CreateTenantProfilePayload } from "@/types/tenant";
import { useMutation } from "@tanstack/react-query";

const onboarding = async (payload: CreateTenantProfilePayload) => {
  const response = await api.post("/tenants/onboarding", payload);
  const data = response.data;
  return data;
};

const useOnboarding = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateTenantProfilePayload) => onboarding(payload),
  });

  return {
    mutateAsync,
    isPending,
  };
};

export default useOnboarding;
