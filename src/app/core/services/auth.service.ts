import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { API_URL } from '../config/api.config';
import type {
  AuthResponse,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  // Usuario autenticado en cache, usado por el menú y guards para leer el rol sin refetch.
  readonly currentUser = signal<AuthenticatedUser | null>(null);

  // Envía email/password al backend.
  // Si el login es correcto, guarda accessToken y refreshToken.
  login(dto: LoginRequest) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, dto).pipe(
      tap((response) => {
        this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
      }),
    );
  }

  // Registra usuario y guarda tokens porque el backend devuelve sesión iniciada.
  register(dto: RegisterRequest) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, dto).pipe(
      tap((response) => {
        this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
      }),
    );
  }

  // Consulta el usuario autenticado usando el access token y lo cachea en currentUser.
  me() {
    return this.http.get<AuthenticatedUser>(`${API_URL}/auth/me`).pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }

  // Pide al backend cerrar sesión y luego limpia tokens locales.
  logout() {
    return this.http.post(`${API_URL}/auth/logout`, {}).pipe(
      finalize(() => {
        this.tokenStorage.clear();
        this.currentUser.set(null);
      }),
    );
  }

  // Limpia tokens sin llamar al backend.
  // Es útil si el token expiró o el backend no responde.
  logoutLocal() {
    this.tokenStorage.clear();
    this.currentUser.set(null);
  }
}