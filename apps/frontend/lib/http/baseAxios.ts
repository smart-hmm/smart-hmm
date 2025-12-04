import axios, { type AxiosInstance } from "axios";

class BaseAxios {
  private static instance: AxiosInstance;

  private constructor() {}

  static getInstance(): AxiosInstance {
    if (!BaseAxios.instance) {
      BaseAxios.instance = axios.create({
        baseURL: "",
        timeout: 10000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    return BaseAxios.instance;
  }
}

export default BaseAxios;
