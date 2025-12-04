import axios, { AxiosInstance } from "axios";

class BaseAxios {
  private static instance: AxiosInstance;

  private constructor() {}

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: "",
        timeout: 10000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return this.instance;
  }
}

export default BaseAxios;
