import qs from "qs";
import { AxiosInstance } from "axios";

export const appyParamsSerializerInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    config.paramsSerializer = {
      ...config.paramsSerializer,
      serialize: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    };
    return config;
  });
};
