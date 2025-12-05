import { getCookie } from "@/services/cookies/cookies";
import type { AxiosInstance } from "axios";

export const applyAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    const token = await getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });
};
