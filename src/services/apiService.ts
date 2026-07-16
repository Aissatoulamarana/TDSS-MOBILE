import {
  ApiError,
  CurrentUser,
  Employee,
  EmployeePermitHistoryResponse,
  LoginCredentials,
  LoginResponse,
} from "../types/index";

// Configuration - À adapter avec votre backend TDSS-Declaration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
const REQUEST_TIMEOUT_MS = 10000;

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async fetchWithTimeout(
    input: Parameters<typeof fetch>[0],
    init: Parameters<typeof fetch>[1] = {},
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw {
          code: "NETWORK_TIMEOUT",
          message: "Le serveur TDSS ne répond pas. Vérifiez votre connexion.",
          statusCode: 0,
        } as ApiError;
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        code: "API_ERROR",
        message: errorData.message || "Une erreur est survenue",
        statusCode: response.status,
      } as ApiError;
    }
    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/auth/jwt/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      const data = await this.handleResponse<LoginResponse>(response);

      if (data.access) {
        this.setToken(data.access);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Utilisateur connecté

  async getMe(): Promise<CurrentUser> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return this.handleResponse<CurrentUser>(response);
  }

  // Vérification par numéro de carte (QR code) → POST /api/declarations/employees/by-card-number/
  async getEmployeeByCardNumber(cardNumber: string): Promise<Employee> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/declarations/employees/by-card-number/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card_number: cardNumber }),
      },
    );
    return this.handleResponse<Employee>(response);
  }

  // Vérification par numéro de passeport → POST /api/declarations/employees/by-passport/
  async getEmployeeByPassport(passportNumber: string): Promise<Employee> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/declarations/employees/by-passport/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passport_number: passportNumber }),
      },
    );
    return this.handleResponse<Employee>(response);
  }

  // Historique des permis par référence employé → POST /api/declarations/employees/by-employee-reference/
  async getEmployeePermitHistory(
    reference: string,
  ): Promise<EmployeePermitHistoryResponse> {
    const response = await fetch(
      `${API_BASE_URL}/declarations/employees/by-employee-reference/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      },
    );
    return this.handleResponse<EmployeePermitHistoryResponse>(response);
  }

  async logout(): Promise<void> {
    this.token = null;
  }
}

export default new ApiService();
