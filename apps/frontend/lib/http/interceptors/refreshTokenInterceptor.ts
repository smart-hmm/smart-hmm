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
        await axios({
          url: "/refresh",
          method: "POST",
          withCredentials: true,
        });
        return instance(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  );
};
