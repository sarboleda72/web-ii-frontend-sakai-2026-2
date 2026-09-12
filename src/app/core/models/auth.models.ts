// Datos que enviamos al endpoint POST /api/v1/auth/login.
export type LoginRequest = {
  email: string;
  password: string;
};

// Datos que enviamos al endpoint POST /api/v1/auth/register.
export type RegisterRequest = {
  email: string;
  name: string;
  password: string;
};

// Respuesta que devuelve el backend al hacer login o registro.
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
};

// Usuario que devuelve GET /api/v1/auth/me.
export type AuthenticatedUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPERVISOR';
};