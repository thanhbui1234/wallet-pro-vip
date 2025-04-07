import { BaseService } from "@/services/BaseService";
import { LoginRequest, LoginResponse } from "@/types/auth";

class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.request<LoginResponse>({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      });

      // Store token in localStorage
      this.setToken((response as { accessToken: string }).accessToken);
      return response as LoginResponse;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Override methods from BaseService
  protected getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  // Change from protected to public
  public logout(): void {
    localStorage.removeItem("accessToken");
  }

  // Additional methods specific to AuthService
  setToken(token: string): void {
    localStorage.setItem("accessToken", token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

const authService = new AuthService();
export default authService;
