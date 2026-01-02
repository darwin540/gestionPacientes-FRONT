export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipoToken: string;
  profesionalId: number;
  nombreProfesional: string;
  email: string;
  isAdmin?: boolean;
}

