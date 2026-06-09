import * as SecureStore from "expo-secure-store";
import { LoginCredentials, User } from "../types/index";
import apiService from "./apiService";

class AuthService {
  async login(email: string, password: string): Promise<User> {
    const credentials: LoginCredentials = { email, password };
    const response = await apiService.login(credentials);

    if (response.success && response.user) {
      // Stocker le token de manière sécurisée
      await SecureStore.setItemAsync("authToken", response.user.token);
      return response.user;
    }

    throw new Error(response.message || "Erreur de connexion");
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync("authToken");
    await apiService.logout();
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("authToken");
    } catch {
      return null;
    }
  }

  async restoreToken(): Promise<User | null> {
    try {
      const token = await this.getStoredToken();
      if (token) {
        apiService.setToken(token);
        // Vous pouvez ajouter une vérification ici si nécessaire
        return null; // À adapter selon votre backend
      }
    } catch {
      // Token invalide ou expiré
      await this.logout();
    }
    return null;
  }
}

export default new AuthService();
