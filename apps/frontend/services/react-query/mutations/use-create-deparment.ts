import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const createDepartment = async (payload: {
  name: string;
  managerId: string;
}) => {
  const response = await api.post("/departments", payload);
  return response.data;
};

const useCreateDepartment = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: { name: string; managerId: string }) =>
      createDepartment(payload),
  });

  return { mutateAsync, isPending, error };
};

export default useCreateDepartment;
