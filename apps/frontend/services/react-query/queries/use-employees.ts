import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import type { EmployeeInfo } from "@/types";
import { Pagination } from "@/types/pagination";

const getEmployees = async ({
  queryKey,
}: {
  queryKey: [
    string,
    {
      name?: string;
      email?: string;
      departmentId?: string;
      code?: string;
      page?: number;
      limit?: number;
    }
  ];
}) => {
  const [, params] = queryKey;
  const response = await api.get("/employees", {
    params: {
      ...(params.departmentId ? { departmentId: params.departmentId } : {}),
      ...(params.name ? { name: params.name } : {}),
      ...(params.email ? { email: params.email } : {}),
      ...(params.code ? { code: params.code } : {}),
      ...(params.page ? { page: params.page } : {}),
      ...(params.limit ? { limit: params.limit } : {}),
    },
  });
  const data = response.data as Pagination<EmployeeInfo> | null;
  return data;
};

const useEmployees = (params: {
  name?: string;
  email?: string;
  code?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_EMPLOYEES, params],
    queryFn: getEmployees,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useEmployees;
