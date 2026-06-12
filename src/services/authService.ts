import * as SecureStore from "expo-secure-store";
import { User } from "../types/index";
import apiService from "./apiService";

const KEY_ACCESS = "accessToken";
const KEY_REFRESH = "refreshToken";

class AuthService {
  async login(email: string, password: string): Promise<User> {
    const response = await apiService.login({ email, password });

    await SecureStore.setItemAsync(KEY_ACCESS, response.access);
    await SecureStore.setItemAsync(KEY_REFRESH, response.refresh);

    const profile = await apiService.getMe();

    return {
      id: profile.slug,
      email: profile.email,
      fullName: profile.name,
      accessToken: response.access,
      refreshToken: response.refresh,
      profile,
    };
  }

  async restoreToken(): Promise<User | null> {
    try {
      const accessToken = await SecureStore.getItemAsync(KEY_ACCESS);
      if (!accessToken) return null;

      apiService.setToken(accessToken);

      const profile = await apiService.getMe();
      const refreshToken = (await SecureStore.getItemAsync(KEY_REFRESH)) ?? "";

      return {
        id: profile.slug,
        email: profile.email,
        fullName: profile.name,
        accessToken,
        refreshToken,
        profile,
      };
    } catch {
      await this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(KEY_ACCESS);
    await SecureStore.deleteItemAsync(KEY_REFRESH);
    await apiService.logout();
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEY_ACCESS);
    } catch {
      return null;
    }
  }
}

export default new AuthService();
