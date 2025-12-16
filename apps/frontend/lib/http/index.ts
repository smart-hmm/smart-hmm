import BaseAxios from "./base-axios";
import { applyAuthInterceptor } from "./interceptors/apply-auth-interceptor";
import { refreshTokenInterceptor } from "./interceptors/refresh-token-interceptor";
import { appyParamsSerializerInterceptor } from "./interceptors/apply-params-serializer-interceptor";

const api = BaseAxios.getInstance();

appyParamsSerializerInterceptor(api);
applyAuthInterceptor(api);
refreshTokenInterceptor(api);

export default api;
