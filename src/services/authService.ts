import * as SecureStore from "expo-secure-store";
import { User } from "../types/index";
import apiService from "./apiService";

class AuthService {
  async login(email: string, password: string): Promise<User> {
    const response = await apiService.login({ email, password });

    await SecureStore.setItemAsync("accessToken", response.access);
    await SecureStore.setItemAsync("refreshToken", response.refresh);

    return {
      id: "",
      email,
      fullName: "",
      accessToken: response.access,
      refreshToken: response.refresh,
    };
  }

  async restoreToken(): Promise<User | null> {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        apiService.setToken(accessToken);
        return {
          id: "",
          email: "",
          fullName: "",
          accessToken,
          refreshToken: (await SecureStore.getItemAsync("refreshToken")) ?? "",
        };
      }
    } catch {
      await this.logout();
    }
    return null;
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await apiService.logout();
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("accessToken");
    } catch {
      return null;
    }
  }
}

export default new AuthService();
