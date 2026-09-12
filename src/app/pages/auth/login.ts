// Component permite declarar una pantalla standalone de Angular.
// inject permite pedir servicios sin usar constructor.
import { Component, inject } from '@angular/core';

// FormBuilder ayuda a crear formularios reactivos.
// ReactiveFormsModule habilita [formGroup] y formControlName en el template.
// Validators permite validar campos antes de llamar al backend.
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Router se usa para navegar al dashboard después del login.
// RouterModule permite usar routerLink en el HTML.
import { Router, RouterModule } from '@angular/router';

// Módulos visuales de PrimeNG/Sakai.
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

// ApiErrorService convierte errores HTTP del backend en mensajes legibles.
import { ApiErrorService } from '../../core/services/api-error.service';

// AuthService contiene la llamada real a POST /api/v1/auth/login.
// También guarda los tokens cuando el backend responde correctamente.
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  // Estos imports son necesarios porque el componente es standalone.
  // Si usas p-button, p-password, formGroup o routerLink en el template,
  // el módulo correspondiente debe estar aquí.
  imports: [ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, ToastModule],

  // MessageService permite mostrar mensajes tipo toast en esta pantalla.
  providers: [MessageService],
  template: `
    <!-- Contenedor donde PrimeNG mostrará los mensajes toast. -->
    <p-toast />

    <!-- Estructura visual del login. Puedes conservar aquí estilos de Sakai. -->
    <div class="flex min-h-screen items-center justify-center bg-surface-100 px-4">
      <div class="w-full max-w-md rounded-xl bg-surface-0 p-8 shadow">
        <div class="mb-6 text-center">
          <h1 class="text-3xl font-bold text-surface-900">WEB II</h1>
          <p class="mt-2 text-surface-600">Inicia sesión para continuar</p>
        </div>

        <!--
          [formGroup]="form" conecta el HTML con el formulario creado en TypeScript.
          (ngSubmit)="submit()" ejecuta el método submit() al enviar.
        -->
        <form class="flex flex-col gap-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="mb-2 block font-medium" for="email">Correo</label>

            <!-- formControlName conecta este input con form.controls.email. -->
            <input id="email" pInputText class="w-full" formControlName="email" />

            <!-- Mensaje visual de validación antes de llamar a NestJS. -->
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <small class="text-red-500">Ingresa un correo válido.</small>
            }
          </div>

          <div>
            <label class="mb-2 block font-medium" for="password">Contraseña</label>
            <!-- Conecta el password visual de PrimeNG con form.controls.password. -->
            <p-password
              inputId="password"
              styleClass="w-full"
              inputStyleClass="w-full"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
            />
            @if (form.controls.password.invalid && form.controls.password.touched) {
              <small class="text-red-500">La contraseña debe tener mínimo 8 caracteres.</small>
            }
          </div>

          <!-- Mientras loading sea true, el botón muestra estado de carga. -->
          <button
            pButton
            type="submit"
            label="Ingresar"
            icon="pi pi-sign-in"
            [loading]="loading"
          ></button>
        </form>

        <div class="mt-6 text-center">
          <!-- Navegación interna de Angular hacia la pantalla de registro. -->
          <a routerLink="/auth/register" class="text-primary">Crear una cuenta</a>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  // formBuilder crea el formulario reactivo.
  private readonly formBuilder = inject(FormBuilder);

  // authService conecta esta pantalla con los endpoints de autenticación de NestJS.
  private readonly authService = inject(AuthService);

  // apiErrorService toma errores de NestJS y devuelve un texto amigable.
  private readonly apiErrorService = inject(ApiErrorService);

  // messageService muestra el toast de error en pantalla.
  private readonly messageService = inject(MessageService);

  // router permite navegar al dashboard cuando el login sale bien.
  private readonly router = inject(Router);

  // Controla el estado visual de carga del botón.
  loading = false;

  // Formulario reactivo: Angular valida antes de llamar a la API.
  // Estos nombres deben coincidir con LoginDto del backend: email y password.
  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Se ejecuta cuando el usuario envía el formulario.
  submit() {
    // Si el formulario no cumple validaciones, no llamamos a NestJS.
    if (this.form.invalid) {
      // Marca los campos como tocados para mostrar los mensajes de error.
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Llama AuthService.login(), que internamente hace:
    // POST http://localhost:3000/api/v1/auth/login
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        // Si el login fue correcto, AuthService ya guardó accessToken y refreshToken.
        // Ahora enviamos al usuario al dashboard protegido.
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        // Si NestJS responde 401, 400 u otro error, quitamos loading.
        this.loading = false;

        // Mostramos el mensaje del backend en un toast amigable.
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo iniciar sesión',
          detail: this.apiErrorService.getMessage(error),
        });
      },
    });
  }
}