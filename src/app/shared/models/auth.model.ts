//Responses
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  firstAccess: boolean;
}

//Requests
export interface LoginRequest {
  document: string;
  password: string;
}

export interface NewPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
