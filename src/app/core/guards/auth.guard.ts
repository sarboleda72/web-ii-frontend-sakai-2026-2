import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/user.models';

export const authGuard: CanActivateChildFn = () => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  if (tokenStorage.isAuthenticated()) {
    return true;
  }

  // Si no hay token, Angular redirige al login.
  return router.createUrlTree(['/auth/login']);
};

// Bloquea la ruta si el rol del usuario autenticado no está en la lista permitida.
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const cachedRole = authService.currentUser()?.role;
    const role = cachedRole ?? (await firstValueFrom(authService.me())).role;

    if (allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};