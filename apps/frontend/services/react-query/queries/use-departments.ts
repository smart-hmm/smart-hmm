import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import api from "@/lib/http";
import { Department } from "@/types";

const getDeparments = async () => {
  const response = await api.get("/departments");
  const data = response.data as Department[] | null;
  return data;
};

const useDepartments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_DEPARTMENTS],
    queryFn: getDeparments,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useDepartments;
