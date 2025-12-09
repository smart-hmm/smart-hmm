import api from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import { FileInfo } from "@/types";

const getFiles = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [, departmentId] = queryKey;
  const response = await api.get(`/files?departmentId=${departmentId}`);
  const data = response.data as FileInfo[];
  return data;
};

const useFiles = (departmentId: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_FILES, departmentId],
    queryFn: getFiles,
    enabled: !!departmentId,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useFiles;
