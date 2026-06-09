import { LoginCredentials, LoginResponse, Card, ApiError } from '../types/index';

// Configuration - À adapter avec votre backend TDSS-Declaration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: 'API_ERROR',
        message: errorData.message || 'Une erreur est survenue',
        statusCode: response.status,
      } as ApiError;
    }
    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse<LoginResponse>(response);
      
      if (data.user?.token) {
        this.setToken(data.user.token);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async validateQRCode(qrCode: string): Promise<Card> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ qrCode }),
      });

      return this.handleResponse<Card>(response);
    } catch (error) {
      throw error;
    }
  }

  async getCardDetails(cardId: string): Promise<Card> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      return this.handleResponse<Card>(response);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.token = null;
  }
}

export default new ApiService();
