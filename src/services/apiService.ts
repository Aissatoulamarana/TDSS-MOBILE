import {
  ApiError,
  Employee,
  LoginCredentials,
  LoginResponse,
} from "../types/index";

// Configuration - À adapter avec votre backend TDSS-Declaration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse<LoginResponse>(response);

      if (data.access) {
        this.setToken(data.access);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Vérification par numéro de carte (QR code) → POST /api/declarations/employees/by-card-number/
  async getEmployeeByCardNumber(cardNumber: string): Promise<Employee> {
    const response = await fetch(
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
    const response = await fetch(
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

  async logout(): Promise<void> {
    this.token = null;
  }
}

export default new ApiService();
