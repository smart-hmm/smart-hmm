import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { Department } from "@/types";

const getDepartment = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [, departmentId] = queryKey;
  if (!departmentId) return;
  const response = await api.get(`/departments/${departmentId}`);
  const data = response.data as Department | null;
  return data;
};

const useDepartment = (departmentId: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_DEPARTMENT, departmentId],
    queryFn: getDepartment,
    enabled: !!departmentId,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useDepartment;
