import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class BaseService {
  protected API_URL = process.env.NEXT_PUBLIC_API_URL;
  protected api: AxiosInstance;
  private isLoginRequest = false;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      timeout: 10000,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(config, "config");

        // Add auth token to headers if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Flag login requests
        if (config.url?.includes("/auth/login")) {
          this.isLoginRequest = true;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        this.isLoginRequest = false;

        // Check if the response has the expected structure
        if (response.data?.status && response.data?.data) {
          return response.data.data;
        }

        return response.data;
      },
      (error) => {
        const status = error.response?.status;

        if (status === 401 && this.isLoginRequest) {
          this.logout();
          window.location.href = "/login";
        }

        this.isLoginRequest = false;
        return Promise.reject(error);
      }
    );
  }

  // Helper method to make API requests
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      return await this.api.request<unknown, T>(config);
    } catch (error) {
      throw error;
    }
  }

  // These methods will be overridden by child classes if needed
  protected getToken(): string | null {
    return null;
  }

  protected logout(): void {}
}
