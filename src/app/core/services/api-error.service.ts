import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {
  getMessage(error: unknown) {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Ocurrió un error inesperado';
    }

    // NestJS a veces devuelve message como arreglo, por ejemplo en errores de DTO.
    if (Array.isArray(error.error?.message)) {
      return error.error.message.join(', ');
    }

    // En errores como ConflictException o UnauthorizedException suele venir como string.
    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el backend';
    }

    return 'No se pudo completar la operación';
  }
}