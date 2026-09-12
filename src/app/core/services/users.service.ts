import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config/api.config';
import type { CreateUserRequest, UpdateUserRequest, User } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  // GET /api/v1/users
  findMany() {
    return this.http.get<User[]>(`${API_URL}/users`);
  }

  // GET /api/v1/users/:id
  findOne(id: string) {
    return this.http.get<User>(`${API_URL}/users/${id}`);
  }

  // POST /api/v1/users
  create(dto: CreateUserRequest) {
    return this.http.post<User>(`${API_URL}/users`, dto);
  }

  // PATCH /api/v1/users/:id
  update(id: string, dto: UpdateUserRequest) {
    return this.http.patch<User>(`${API_URL}/users/${id}`, dto);
  }

  // DELETE /api/v1/users/:id
  // En el backend este endpoint desactiva, no borra físicamente.
  deactivate(id: string) {
    return this.http.delete<User>(`${API_URL}/users/${id}`);
  }
}