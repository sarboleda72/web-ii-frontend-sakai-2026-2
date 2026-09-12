import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'web_ii_access_token';
const REFRESH_TOKEN_KEY = 'web_ii_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  // Guarda ambos tokens después de login o registro.
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  // Devuelve el access token usado para consumir rutas protegidas.
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  // Devuelve el refresh token usado para renovar sesión.
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Indica si hay un access token guardado.
  isAuthenticated() {
    return Boolean(this.getAccessToken());
  }

  // Limpia sesión local.
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}