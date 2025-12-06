import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { EmployeeInfo } from "@/types";

const getEmployeesByDepartmentId = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [, departmentId] = queryKey;
  if (!departmentId) return;
  const response = await api.get(`/employees/department/${departmentId}`);
  const data = response.data as EmployeeInfo[] | null;
  return data ?? [];
};

const useEmployeesByDepartmentId = (departmentId: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_EMPLOYEES_BY_DEPARTMENT_ID, departmentId],
    queryFn: getEmployeesByDepartmentId,
    enabled: !!departmentId,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useEmployeesByDepartmentId;
