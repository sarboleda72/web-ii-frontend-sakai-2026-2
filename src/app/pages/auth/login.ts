import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiErrorService } from '../../core/services/api-error.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />

    <main class="login-screen">
      <div class="login-screen__image"></div>
      <div class="login-screen__veil"></div>

      <section class="login-workbench" aria-label="Inicio de sesión">
        <aside class="login-workbench__status">
          <div class="brand-mark">
            <span><i class="pi pi-wrench"></i></span>
            <strong>WEB II</strong>
          </div>

          <div class="status-copy">
            <p>Acceso de operador</p>
            <h1>Centro de herramientas</h1>
            <span>Usuarios, tablero y tareas administrativas en un solo punto de entrada.</span>
          </div>

          <div class="status-strip" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </aside>

        <div class="login-workbench__form">
          <header>
            <p>Credenciales</p>
            <h2>Iniciar sesión</h2>
          </header>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <label for="email">
              <span>Correo</span>
              <input id="email" type="email" autocomplete="email" formControlName="email" />
            </label>
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <small>Ingresa un correo válido.</small>
            }

            <label for="password">
              <span>Contraseña</span>
              <input id="password" type="password" autocomplete="current-password" formControlName="password" />
            </label>
            @if (form.controls.password.invalid && form.controls.password.touched) {
              <small>La contraseña debe tener mínimo 8 caracteres.</small>
            }

            <button class="tool-submit" type="submit" [disabled]="loading">
              <span>{{ loading ? 'Validando acceso' : 'Entrar al panel' }}</span>
              <i class="pi" [class.pi-spin]="loading" [class.pi-spinner]="loading" [class.pi-arrow-right]="!loading"></i>
            </button>
          </form>

          <footer>
            <span>¿Nuevo usuario?</span>
            <a routerLink="/auth/register">Solicitar registro</a>
          </footer>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .login-screen {
      position: relative;
      min-height: 100vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: clamp(1rem, 3vw, 3rem);
      background: #020617;
      color: #f8fafc;
    }

    .login-screen__image,
    .login-screen__veil {
      position: absolute;
      inset: 0;
    }

    .login-screen__image {
      background: url('/fondo.jpg') center/cover no-repeat;
      filter: blur(5px) saturate(0.85);
      transform: scale(1.04);
      opacity: 0.72;
    }

    .login-screen__veil {
      background:
        linear-gradient(90deg, rgba(2, 6, 23, 0.95), rgba(15, 23, 42, 0.72) 45%, rgba(2, 6, 23, 0.58)),
        radial-gradient(circle at 78% 16%, rgba(34, 197, 94, 0.28), transparent 28%);
    }

    .login-workbench {
      position: relative;
      width: min(1080px, 100%);
      min-height: min(680px, calc(100vh - 2rem));
      display: grid;
      grid-template-columns: minmax(260px, 0.86fr) minmax(320px, 0.64fr);
      border: 1px solid rgba(226, 232, 240, 0.2);
      background: rgba(2, 6, 23, 0.52);
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(18px);
    }

    .login-workbench__status,
    .login-workbench__form {
      padding: clamp(1.5rem, 4vw, 3.25rem);
    }

    .login-workbench__status {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid rgba(226, 232, 240, 0.16);
    }

    .brand-mark {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-size: 0.95rem;
      letter-spacing: 0.14em;
    }

    .brand-mark span {
      display: grid;
      width: 2.75rem;
      height: 2.75rem;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(255, 255, 255, 0.09);
    }

    .status-copy {
      max-width: 32rem;
    }

    .status-copy p,
    .login-workbench__form header p {
      margin: 0 0 0.9rem;
      color: #86efac;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .status-copy h1 {
      margin: 0;
      font-size: clamp(2.5rem, 6vw, 5.4rem);
      line-height: 0.93;
      font-weight: 800;
    }

    .status-copy span {
      display: block;
      max-width: 28rem;
      margin-top: 1.35rem;
      color: rgba(248, 250, 252, 0.72);
      font-size: 1.02rem;
      line-height: 1.6;
    }

    .status-strip {
      display: grid;
      grid-template-columns: 1.2fr 0.55fr 0.9fr 0.35fr;
      gap: 0.6rem;
    }

    .status-strip span {
      height: 0.42rem;
      background: rgba(134, 239, 172, 0.7);
    }

    .status-strip span:nth-child(even) {
      background: rgba(226, 232, 240, 0.36);
    }

    .login-workbench__form {
      align-self: center;
    }

    .login-workbench__form header {
      margin-bottom: 2rem;
    }

    .login-workbench__form h2 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3.35rem);
      line-height: 1;
      font-weight: 800;
    }

    form {
      display: grid;
      gap: 1rem;
    }

    label {
      display: grid;
      gap: 0.5rem;
      color: rgba(248, 250, 252, 0.72);
      font-size: 0.84rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      min-height: 3.35rem;
      border: 1px solid rgba(148, 163, 184, 0.26);
      border-left: 4px solid #86efac;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.82));
      color: #f8fafc;
      border-radius: 0;
      padding: 0 1rem;
      outline: 0;
      font: inherit;
      box-shadow: inset 0 0 0 1px rgba(2, 6, 23, 0.5);
      transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    input:focus {
      border-color: rgba(134, 239, 172, 0.9);
      box-shadow: inset 0 0 0 1px rgba(134, 239, 172, 0.4), 0 0 0 3px rgba(134, 239, 172, 0.12);
    }

    small {
      margin-top: -0.3rem;
      color: #fca5a5;
    }

    .tool-submit {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      margin-top: 0.65rem;
      min-height: 3.35rem;
      border: 1px solid rgba(134, 239, 172, 0.62);
      border-radius: 0;
      background: #86efac;
      color: #052e16;
      padding: 0 1.1rem 0 1.25rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      cursor: pointer;
      box-shadow: 8px 8px 0 rgba(20, 83, 45, 0.55);
      transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .tool-submit:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 11px 11px 0 rgba(20, 83, 45, 0.55);
      background: #bbf7d0;
    }

    .tool-submit:disabled {
      cursor: wait;
      opacity: 0.82;
      box-shadow: 4px 4px 0 rgba(20, 83, 45, 0.42);
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.4rem;
      border-top: 1px solid rgba(226, 232, 240, 0.16);
      color: rgba(248, 250, 252, 0.68);
    }

    footer a {
      color: #86efac;
      font-weight: 800;
    }

    @media (max-width: 820px) {
      .login-workbench {
        min-height: auto;
        grid-template-columns: 1fr;
      }

      .login-workbench__status {
        gap: 2rem;
        border-right: 0;
        border-bottom: 1px solid rgba(226, 232, 240, 0.16);
      }

      .status-copy h1 {
        font-size: clamp(2.25rem, 14vw, 4.4rem);
      }
    }
  `],
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  loading = false;

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo iniciar sesión',
          detail: this.apiErrorService.getMessage(error),
        });
      },
    });
  }
}
