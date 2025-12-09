import api from "@/lib/http";
import { ConfirmUploadPayload } from "@/types";
import { useMutation } from "@tanstack/react-query";

const confirmUpload = async (payload: ConfirmUploadPayload) => {
  const response = await api.post("/files", payload);
  const data = response.data;
  return data;
};

const useConfirmUpload = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ConfirmUploadPayload) => confirmUpload(payload),
  });

  return {
    mutateAsync,
    isPending,
  };
};

export default useConfirmUpload;
