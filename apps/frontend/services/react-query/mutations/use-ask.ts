import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const ask = async (payload: { question: string }) => {
  const body = {
    question: payload.question,
    maxChunks: 5,
  };

  const response = await api.post("/ai/ask", body);
  const data = response.data as {
    answer: string;
  };

  return data;
};

const useAsk = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { question: string }) => ask(payload),
  });

  return {
    mutateAsync,
    isPending,
  };
};

export default useAsk;
