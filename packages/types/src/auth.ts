export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  username: string;
  password?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
