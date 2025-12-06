import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { EmployeeInfo } from "@/types";

const getEmployees = async () => {
  const response = await api.get("/employees");
  const data = response.data as EmployeeInfo[] | null;
  return data ?? [];
};

const useEmployees = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_EMPLOYEES],
    queryFn: getEmployees,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useEmployees;
