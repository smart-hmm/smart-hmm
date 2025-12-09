import { useMutation } from "@tanstack/react-query";
import api from "@/lib/http";

const genPresignedURL = async (payload: { path: string, contentType: string }) => {
  const { path, contentType } = payload;
  const response = await api.post("/upload/presign", { path, contentType });
  const data = response.data;
  return data as { url: string };
};

const useGenPresignedURL = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { path: string, contentType: string }) => genPresignedURL(payload),
  });

  return {
    mutateAsync,
    isPending,
  };
};

export default useGenPresignedURL;
