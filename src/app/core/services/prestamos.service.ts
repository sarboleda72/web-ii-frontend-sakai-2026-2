import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config/api.config';
import type { CreatePrestamoRequest, Prestamo, UpdatePrestamoRequest } from '../models/prestamo.models';

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  private readonly http = inject(HttpClient);

  findMany() {
    return this.http.get<Prestamo[]>(`${API_URL}/prestamos`);
  }

  search(q: string) {
    return this.http.get<Prestamo[]>(`${API_URL}/prestamos`, { params: { q } });
  }

  findOne(id: string) {
    return this.http.get<Prestamo>(`${API_URL}/prestamos/${id}`);
  }

  create(dto: CreatePrestamoRequest) {
    return this.http.post<Prestamo>(`${API_URL}/prestamos`, dto);
  }

  update(id: string, dto: UpdatePrestamoRequest) {
    return this.http.patch<Prestamo>(`${API_URL}/prestamos/${id}`, dto);
  }

  devolver(id: string) {
    return this.http.delete<Prestamo>(`${API_URL}/prestamos/${id}`);
  }
}
