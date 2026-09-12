import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../config/api.config';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const accessToken = tokenStorage.getAccessToken();

  // Solo agregamos token a peticiones que van hacia nuestra API.
  const isApiRequest = request.url.startsWith(API_URL);

  if (!accessToken || !isApiRequest) {
    return next(request);
  }

  // clone crea una copia de la petición con headers adicionales.
  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authenticatedRequest);
};