import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { TenantInfo } from "@/types/tenant";

const getTenantBySlug = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [_, slug] = queryKey;
  if (!slug) return;
  const response = await api.get(`/tenants/${slug}`);
  const data = response.data as TenantInfo;
  return data;
};

const useTenantBySlug = (slug: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_TENANT_BY_SLUG, slug],
    queryFn: getTenantBySlug,
    enabled: !!slug,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useTenantBySlug;
