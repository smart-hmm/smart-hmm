import { setCookie } from "@/services/cookies/cookies";
import type { AuthInfo } from "@/types";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

export const refreshTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      const original = err.config as InternalAxiosRequestConfig & {
        _retry: boolean;
      };

      if (err.response?.status !== 401 || original._retry) {
        return Promise.reject(err);
      }

      original._retry = true;

      try {
        const result = await axios({
          url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
          method: "POST",
          withCredentials: true,
        });
        const data = result.data as AuthInfo;
        await setCookie(
          "access_token",
          data.accessToken,
          new Date(data.accessExpiresAt)
        );
        return instance(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  );
};
