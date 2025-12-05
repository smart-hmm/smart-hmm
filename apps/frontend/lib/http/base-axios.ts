import axios, { type AxiosInstance } from "axios";

class BaseAxios {
  private static instance: AxiosInstance;

  private constructor() {}

  static getInstance(): AxiosInstance {
    if (!BaseAxios.instance) {
      BaseAxios.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:8080/api/v1",
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
