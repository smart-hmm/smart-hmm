import BaseAxios from "./baseAxios";
import { refreshTokenInterceptor } from "./interceptors/refreshTokenInterceptor";

const api = BaseAxios.getInstance();

refreshTokenInterceptor(api)

export default api;