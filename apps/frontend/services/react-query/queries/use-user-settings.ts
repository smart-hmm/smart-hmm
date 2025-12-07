import api from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";

const getUserSettings = async () => {
  const response = await api.get("/user-settings");
  const data = response.data as {
    userId: string;
    key: string;
    value: Record<string, string | number | string[] | number[]>;
    updatedAt: string;
  }[];
  return data;
};

const useUserSettings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_USER_SETTINGS],
    queryFn: getUserSettings,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useUserSettings;
