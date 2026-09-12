import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import type { AuthenticatedUser } from '../../core/models/auth.models';

type ToolMetric = {
  label: string;
  value: string;
  detail: string;
  icon: string;
};

type WorkItem = {
  title: string;
  description: string;
  status: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main class="tool-dashboard">
      <section class="dashboard-hero">
        <div>
          <p class="eyebrow">Centro de herramientas</p>
          <h1>Panel operativo</h1>
          <span>Controla usuarios, revisa el estado del sistema y mantén a la vista las acciones principales.</span>
        </div>

        <aside class="operator-panel">
          <span>Sesión activa</span>
          <strong>{{ user()?.email || 'Cargando usuario...' }}</strong>
          <small>{{ roleLabel() }}</small>
        </aside>
      </section>

      <section class="metric-grid" aria-label="Resumen operativo">
        @for (metric of metrics; track metric.label) {
          <article class="metric-tile">
            <div class="metric-icon">
              <i class="pi {{ metric.icon }}"></i>
            </div>
            <div>
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
              <small>{{ metric.detail }}</small>
            </div>
          </article>
        }
      </section>

      <section class="dashboard-grid">
        <article class="work-panel">
          <header>
            <p class="eyebrow">Prioridades</p>
            <h2>Flujo de trabajo</h2>
          </header>

          <div class="work-list">
            @for (item of workItems; track item.title) {
              <div class="work-row">
                <div>
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.description }}</span>
                </div>
                <small>{{ item.status }}</small>
              </div>
            }
          </div>
        </article>

        <article class="quick-panel">
          <header>
            <p class="eyebrow">Accesos</p>
            <h2>Herramientas rápidas</h2>
          </header>

          <nav aria-label="Herramientas rápidas">
            <a routerLink="/users">
              <i class="pi pi-users"></i>
              <span>Administrar usuarios</span>
            </a>
            <a routerLink="/">
              <i class="pi pi-chart-line"></i>
              <span>Revisar tablero</span>
            </a>
            <a routerLink="/auth/register">
              <i class="pi pi-user-plus"></i>
              <span>Nuevo registro</span>
            </a>
          </nav>
        </article>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .tool-dashboard {
      display: grid;
      gap: 1.25rem;
      min-height: calc(100vh - 9rem);
      padding: clamp(0.25rem, 1vw, 0.75rem);
      color: #e5e7eb;
    }

    .dashboard-hero,
    .metric-tile,
    .work-panel,
    .quick-panel {
      border: 1px solid rgba(148, 163, 184, 0.22);
      background:
        linear-gradient(135deg, rgba(2, 6, 23, 0.94), rgba(15, 23, 42, 0.9)),
        url('/fondo.jpg') center/cover no-repeat;
      box-shadow: 0 18px 45px rgba(2, 6, 23, 0.18);
    }

    .dashboard-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
      gap: 1.5rem;
      align-items: stretch;
      padding: clamp(1.25rem, 3vw, 2.25rem);
      overflow: hidden;
      position: relative;
    }

    .dashboard-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(2, 6, 23, 0.36), rgba(22, 101, 52, 0.18));
      pointer-events: none;
    }

    .dashboard-hero > * {
      position: relative;
    }

    .eyebrow {
      margin: 0 0 0.75rem;
      color: #86efac;
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h1,
    h2 {
      margin: 0;
      color: #f8fafc;
      line-height: 1;
      font-weight: 850;
    }

    h1 {
      font-size: clamp(2.4rem, 6vw, 5.2rem);
      max-width: 10ch;
    }

    h2 {
      font-size: clamp(1.45rem, 3vw, 2.35rem);
    }

    .dashboard-hero span {
      display: block;
      max-width: 44rem;
      margin-top: 1rem;
      color: rgba(248, 250, 252, 0.72);
      font-size: 1rem;
      line-height: 1.65;
    }

    .operator-panel {
      display: grid;
      align-content: end;
      min-height: 12rem;
      padding: 1.25rem;
      border-left: 4px solid #86efac;
      background: rgba(2, 6, 23, 0.72);
    }

    .operator-panel span,
    .metric-tile span,
    .work-row span,
    .operator-panel small,
    .metric-tile small,
    .work-row small {
      color: rgba(248, 250, 252, 0.66);
    }

    .operator-panel strong {
      margin-top: 0.4rem;
      color: #f8fafc;
      font-size: clamp(1.1rem, 2vw, 1.45rem);
      word-break: break-word;
    }

    .operator-panel small {
      margin-top: 0.35rem;
      color: #86efac;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .metric-tile {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 1rem;
      align-items: center;
      min-height: 9rem;
      padding: 1rem;
      background-image: linear-gradient(135deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.88));
    }

    .metric-icon {
      display: grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      border: 1px solid rgba(134, 239, 172, 0.45);
      color: #86efac;
      background: rgba(20, 83, 45, 0.3);
    }

    .metric-tile span,
    .metric-tile small {
      display: block;
    }

    .metric-tile strong {
      display: block;
      margin: 0.35rem 0;
      color: #f8fafc;
      font-size: 2rem;
      line-height: 1;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.62fr);
      gap: 1rem;
    }

    .work-panel,
    .quick-panel {
      padding: clamp(1rem, 2.4vw, 1.6rem);
      background-image: linear-gradient(135deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.9));
    }

    .work-list {
      display: grid;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    .work-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.2);
      background: rgba(2, 6, 23, 0.42);
    }

    .work-row strong,
    .work-row span {
      display: block;
    }

    .work-row strong {
      color: #f8fafc;
      font-size: 1rem;
    }

    .work-row span {
      margin-top: 0.35rem;
      line-height: 1.45;
    }

    .work-row small {
      min-width: 6.5rem;
      padding: 0.45rem 0.65rem;
      border: 1px solid rgba(253, 230, 138, 0.45);
      color: #fde68a;
      text-align: center;
      font-weight: 800;
      text-transform: uppercase;
    }

    .quick-panel nav {
      display: grid;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    .quick-panel a {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-height: 3.4rem;
      padding: 0 1rem;
      border: 1px solid rgba(134, 239, 172, 0.35);
      color: #f8fafc;
      background: rgba(2, 6, 23, 0.5);
      text-decoration: none;
      font-weight: 800;
      transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
    }

    .quick-panel a:hover {
      transform: translateX(4px);
      border-color: rgba(134, 239, 172, 0.8);
      background: rgba(20, 83, 45, 0.34);
    }

    .quick-panel i {
      color: #86efac;
    }

    @media (max-width: 1100px) {
      .metric-grid,
      .dashboard-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .quick-panel {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 760px) {
      .dashboard-hero,
      .metric-grid,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .work-row {
        grid-template-columns: 1fr;
      }

      .work-row small {
        width: fit-content;
      }
    }
  `],
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);

  user = signal<AuthenticatedUser | null>(null);

  metrics: ToolMetric[] = [
    {
      label: 'Usuarios',
      value: 'Panel',
      detail: 'Gestión disponible desde el menú',
      icon: 'pi-users',
    },
    {
      label: 'Acceso',
      value: 'Activo',
      detail: 'Sesión autenticada por token',
      icon: 'pi-shield',
    },
    {
      label: 'Módulos',
      value: '02',
      detail: 'Dashboard y administración',
      icon: 'pi-th-large',
    },
    {
      label: 'Estado',
      value: 'Listo',
      detail: 'Interfaz preparada para operar',
      icon: 'pi-check-circle',
    },
  ];

  workItems: WorkItem[] = [
    {
      title: 'Revisar usuarios registrados',
      description: 'Consulta, valida y administra cuentas desde el módulo de usuarios.',
      status: 'Disponible',
    },
    {
      title: 'Mantener sesión segura',
      description: 'El cierre de sesión limpia tokens locales y retorna al acceso.',
      status: 'Activo',
    },
    {
      title: 'Extender métricas reales',
      description: 'Este panel está listo para conectar indicadores del backend.',
      status: 'Siguiente',
    },
  ];

  ngOnInit() {
    this.authService.me().subscribe({
      next: (user) => {
        this.user.set(user);
      },
    });
  }

  roleLabel() {
    const role = this.user()?.role;

    if (!role) {
      return 'Validando perfil';
    }

    const labels: Record<AuthenticatedUser['role'], string> = {
      ADMIN: 'Administrador',
      USER: 'Usuario',
      SUPERVISOR: 'Supervisor',
    };

    return labels[role];
  }
}
