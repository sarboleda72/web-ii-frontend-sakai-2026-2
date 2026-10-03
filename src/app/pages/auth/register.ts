import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiErrorService } from '../../core/services/api-error.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />

    <main class="register-screen">
      <div class="register-screen__image"></div>
      <div class="register-screen__veil"></div>

      <section class="register-panel" aria-label="Registro de usuario">
        <nav>
          <a routerLink="/auth/login">
            <i class="pi pi-arrow-left"></i>
            <span>Volver</span>
          </a>
          <strong>WEB II</strong>
        </nav>

        <div class="register-panel__content">
          <header>
            <p>Alta de usuario</p>
            <h1>Crear acceso administrativo</h1>
            <span>Registra una cuenta para operar el panel de usuarios y consultar el tablero.</span>
          </header>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field-line">
              <label for="name">Nombre</label>
              <input id="name" autocomplete="name" formControlName="name" />
              @if (form.controls.name.invalid && form.controls.name.touched) {
                <small>El nombre debe tener mínimo 2 caracteres.</small>
              }
            </div>

            <div class="field-line">
              <label for="email">Correo</label>
              <input id="email" type="email" autocomplete="email" formControlName="email" />
              @if (form.controls.email.invalid && form.controls.email.touched) {
                <small>Ingresa un correo válido.</small>
              }
            </div>

            <div class="field-line">
              <label for="password">Contraseña</label>
              <input id="password" type="password" autocomplete="new-password" formControlName="password" />
              @if (form.controls.password.invalid && form.controls.password.touched) {
                <small>La contraseña debe tener mínimo 8 caracteres.</small>
              }
            </div>

            <button class="register-submit" type="submit" [disabled]="loading">
              <i class="pi" [class.pi-spin]="loading" [class.pi-spinner]="loading" [class.pi-check]="!loading"></i>
              <span>{{ loading ? 'Creando acceso' : 'Crear cuenta' }}</span>
            </button>
          </form>
        </div>

        <aside class="register-panel__rail" aria-hidden="true">
          <div>
            <span>01</span>
            <strong>Identidad</strong>
          </div>
          <div>
            <span>02</span>
            <strong>Correo</strong>
          </div>
          <div>
            <span>03</span>
            <strong>Acceso</strong>
          </div>
        </aside>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .register-screen {
      position: relative;
      min-height: 100vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: clamp(1rem, 3vw, 3rem);
      background: #111827;
      color: #f8fafc;
    }

    .register-screen__image,
    .register-screen__veil {
      position: absolute;
      inset: 0;
    }

    .register-screen__image {
      background: url('/fondo.jpg') center/cover no-repeat;
      filter: blur(6px) grayscale(0.25);
      transform: scale(1.05);
      opacity: 0.72;
    }

    .register-screen__veil {
      background:
        linear-gradient(135deg, rgba(17, 24, 39, 0.92), rgba(15, 23, 42, 0.72) 52%, rgba(23, 37, 84, 0.58)),
        radial-gradient(circle at 10% 88%, rgba(234, 179, 8, 0.22), transparent 30%);
    }

    .register-panel {
      position: relative;
      width: min(1040px, 100%);
      min-height: min(700px, calc(100vh - 2rem));
      display: grid;
      grid-template-columns: 1fr 11rem;
      grid-template-rows: auto 1fr;
      border: 1px solid rgba(226, 232, 240, 0.18);
      background: rgba(15, 23, 42, 0.54);
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.44);
      backdrop-filter: blur(18px);
    }

    nav {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem clamp(1.25rem, 3vw, 2rem);
      border-bottom: 1px solid rgba(226, 232, 240, 0.16);
      letter-spacing: 0.14em;
    }

    nav a {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      color: rgba(248, 250, 252, 0.74);
      font-weight: 800;
      letter-spacing: 0.04em;
      text-decoration: none;
    }

    .register-panel__content {
      align-self: center;
      width: min(640px, 100%);
      padding: clamp(1.5rem, 5vw, 4rem);
    }

    header {
      max-width: 36rem;
      margin-bottom: 2.2rem;
    }

    header p {
      margin: 0 0 0.85rem;
      color: #fde68a;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    header h1 {
      margin: 0;
      color: #f8fafc;
      font-size: clamp(2.3rem, 6vw, 4.7rem);
      line-height: 0.96;
      font-weight: 850;
      max-width: 12ch;
    }

    header span {
      display: block;
      max-width: 30rem;
      margin-top: 1.15rem;
      color: rgba(248, 250, 252, 0.7);
      line-height: 1.6;
    }

    form {
      display: grid;
      gap: 1rem;
      max-width: 30rem;
    }

    .field-line {
      display: grid;
      grid-template-columns: 7.5rem minmax(0, 1fr);
      align-items: center;
      gap: 0.8rem;
    }

    label {
      color: rgba(248, 250, 252, 0.7);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      min-height: 3.2rem;
      border: 1px solid rgba(226, 232, 240, 0.18);
      border-bottom: 3px solid #fde68a;
      background:
        linear-gradient(90deg, rgba(234, 179, 8, 0.08), transparent 32%),
        rgba(2, 6, 23, 0.58);
      color: #f8fafc;
      border-radius: 12px;
      padding: 0 1rem;
      outline: 0;
      font: inherit;
      transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    input:focus {
      border-color: rgba(253, 230, 138, 0.78);
      border-bottom-color: #facc15;
      box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.14);
    }

    small {
      grid-column: 2;
      margin-top: -0.45rem;
      color: #fca5a5;
    }

    .register-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      grid-column: 1 / -1;
      min-height: 3.3rem;
      margin-top: 0.65rem;
      border: 1px solid rgba(253, 230, 138, 0.72);
      border-radius: 12px;
      background: transparent;
      color: #fde68a;
      padding: 0 1.25rem;
      font-weight: 850;
      letter-spacing: 0.03em;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px rgba(253, 230, 138, 0.24);
      position: relative;
      overflow: hidden;
      transition: color 160ms ease, border-color 160ms ease, transform 160ms ease;
    }

    .register-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #fde68a;
      transform: translateX(-101%);
      transition: transform 180ms ease;
      z-index: -1;
    }

    .register-submit:hover:not(:disabled) {
      color: #422006;
      border-color: #fde68a;
      transform: translateY(-1px);
    }

    .register-submit:hover:not(:disabled)::before {
      transform: translateX(0);
    }

    .register-submit:disabled {
      cursor: wait;
      opacity: 0.75;
    }

    .register-panel__rail {
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      border-left: 1px solid rgba(226, 232, 240, 0.16);
    }

    .register-panel__rail div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.2rem;
      border-bottom: 1px solid rgba(226, 232, 240, 0.16);
      background: rgba(255, 255, 255, 0.04);
    }

    .register-panel__rail div:last-child {
      border-bottom: 0;
    }

    .register-panel__rail span {
      color: #fde68a;
      font-weight: 900;
    }

    .register-panel__rail strong {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      align-self: end;
      color: rgba(248, 250, 252, 0.72);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    @media (max-width: 820px) {
      .register-panel {
        min-height: auto;
        grid-template-columns: 1fr;
      }

      .register-panel__rail {
        display: none;
      }

      .field-line {
        grid-template-columns: 1fr;
      }

      small {
        grid-column: 1;
      }
    }
  `],
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  loading = false;

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo crear la cuenta',
          detail: this.apiErrorService.getMessage(error),
        });
      },
    });
  }
}
