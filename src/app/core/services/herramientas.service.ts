import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config/api.config';
import type { CreateHerramientaRequest, Herramienta, UpdateHerramientaRequest } from '../models/herramienta.models';

@Injectable({
  providedIn: 'root',
})
export class HerramientasService {
  private readonly http = inject(HttpClient);

  findMany() {
    return this.http.get<Herramienta[]>(`${API_URL}/herramientas`);
  }

  // Búsqueda en el backend por nombre/descripción/categoría.
  search(q: string) {
    return this.http.get<Herramienta[]>(`${API_URL}/herramientas`, { params: { q } });
  }

  findOne(id: string) {
    return this.http.get<Herramienta>(`${API_URL}/herramientas/${id}`);
  }

  create(dto: CreateHerramientaRequest) {
    return this.http.post<Herramienta>(`${API_URL}/herramientas`, dto);
  }

  update(id: string, dto: UpdateHerramientaRequest) {
    return this.http.patch<Herramienta>(`${API_URL}/herramientas/${id}`, dto);
  }

  deactivate(id: string) {
    return this.http.delete<Herramienta>(`${API_URL}/herramientas/${id}`);
  }
}
