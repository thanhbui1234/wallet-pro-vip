// services/api.ts
import { getTokenAuth } from "@/utils/token";
import axios from "axios";
// import { toast } from "sonner";

// Flag để tránh check lỗi 401 khi login
let isLoginRequest = false;

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
});

// Attach JWT to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = getTokenAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url?.includes("/auth/login")) {
      isLoginRequest = true;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling without refresh-token logic
api.interceptors.response.use(
  (response) => {
    isLoginRequest = false;
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !isLoginRequest) {
      //   toast.error("Unauthorized. Please login again.");
    }

    isLoginRequest = false;
    return Promise.reject(error);
  }
);
