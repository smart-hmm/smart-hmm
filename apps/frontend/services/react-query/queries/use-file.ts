import api from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import { FileInfo } from "@/types";

const getFile = async ({ queryKey }: { queryKey: [string, string | null] }) => {
  const [, id] = queryKey;
  const response = await api.get(`/files/${id}`);
  const data = response.data as {
    file: FileInfo;
    downloadURL: string;
  };
  return data;
};

const useFile = (id: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_FILE, id],
    queryFn: getFile,
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useFile;
