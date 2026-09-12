import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import type { AuthenticatedUser } from '../../core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    @if (user()) {
      <div class="card">
        <h2 class="m-0">Bienvenido</h2>
        <p class="mb-0">{{ user()?.email }} - {{ user()?.role }}</p>
      </div>
    }
  `,
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);

  user = signal<AuthenticatedUser | null>(null);

  ngOnInit() {
    this.authService.me().subscribe({
      next: (user) => {
        this.user.set(user);
      },
    });
  }
}