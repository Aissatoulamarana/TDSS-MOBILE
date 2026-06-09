// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  fullName: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Types pour la carte
export interface Card {
  id: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  issueDate: string;
  status: 'valid' | 'expired' | 'invalid' | 'revoked';
  cardType: string;
}

export interface QRScanData {
  cardId: string;
  qrCode: string;
  timestamp: string;
}

// Types pour les erreurs
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}
