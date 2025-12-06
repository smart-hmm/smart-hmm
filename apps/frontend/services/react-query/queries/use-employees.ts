import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { EmployeeInfo } from "@/types";

const getEmployees = async ({
  queryKey,
}: {
  queryKey: [
    string,
    {
      name?: string;
      email?: string;
      departmentId?: string;
    }
  ];
}) => {
  const [, params] = queryKey;
  const response = await api.get("/employees", {
    params: {
      ...(params.departmentId ? { departmentId: params.departmentId } : {}),
      ...(params.name ? { name: params.name } : {}),
      ...(params.email ? { email: params.email } : {}),
    },
  });
  const data = response.data as EmployeeInfo[] | null;
  return data ?? [];
};

const useEmployees = (params: {
  name?: string;
  email?: string;
  departmentId?: string;
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
