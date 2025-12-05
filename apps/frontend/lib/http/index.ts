import BaseAxios from "./base-axios";
import { applyAuthInterceptor } from "./interceptors/apply-auth-interceptor";
import { refreshTokenInterceptor } from "./interceptors/refresh-token-interceptor";

const api = BaseAxios.getInstance();

applyAuthInterceptor(api)
refreshTokenInterceptor(api)

export default api;