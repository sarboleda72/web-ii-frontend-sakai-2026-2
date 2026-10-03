import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiErrorService } from '../../core/services/api-error.service';
import { UsersService } from '../../core/services/users.service';
import { AvatarService } from '../../core/services/avatar.service';
import type { User, UserRole } from '../../core/models/user.models';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectModule,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  styles: [`
    .tools-screen { display: grid; gap: 1.25rem; color: #e5e7eb; padding: clamp(0.25rem, 1vw, 0.75rem); }
    .tools-panel { position: relative; border: 1px solid rgba(148, 163, 184, 0.22); background: linear-gradient(135deg, rgba(2, 6, 23, 0.94), rgba(15, 23, 42, 0.9)), url('/fondo.jpg') center/cover no-repeat; box-shadow: 0 18px 45px rgba(2, 6, 23, 0.18); padding: clamp(1.25rem, 3vw, 2.25rem); border-radius: 18px; }
    h2 { color: #f8fafc; }
    .tools-panel p { color: #86efac; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
    input { width: 100%; min-height: 3rem; border: 1px solid rgba(148, 163, 184, 0.26); border-left: 4px solid #86efac; background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.82)); color: #f8fafc; border-radius: 12px; padding: 0 1rem; outline: 0; }
    input:focus { border-color: rgba(134, 239, 172, 0.9); box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.12); }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th { background: rgba(6, 78, 59, 0.85); color: #bbf7d0; border-bottom: 1px solid rgba(134, 239, 172, 0.4); font-weight: 700; letter-spacing: 0.04em; }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr { background: rgba(2, 6, 23, 0.6); color: #f8fafc; border-bottom: 1px solid rgba(134, 239, 172, 0.12); }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover { background: rgba(34, 197, 94, 0.14); }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td { border: none; padding: 0.85rem 1rem; }
    :host ::ng-deep .p-dialog { background: rgba(2, 6, 23, 0.97); color: #f8fafc; border: 1px solid rgba(134, 239, 172, 0.3); border-radius: 18px; }
    :host ::ng-deep .p-dialog .p-dialog-header { background: linear-gradient(90deg, #052e16, #14532d); color: #ecfdf5; border-radius: 18px 18px 0 0; }
    :host ::ng-deep .p-dialog .p-dialog-content { padding: 1.5rem; }
  `],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="tools-screen">
      <div class="tools-panel">
      <div class="card" style="background: transparent">
      <p-toolbar styleClass="mb-4">
        <ng-template #start>
          <div>
            <h2 class="m-0 text-2xl font-semibold">Usuarios</h2>
            <p class="m-0 text-surface-500">Administración básica de usuarios</p>
          </div>
        </ng-template>

        <ng-template #end>
          <button pButton label="Nuevo" icon="pi pi-plus" (click)="openCreate()"></button>
        </ng-template>
      </p-toolbar>

      <div class="mb-4">
        <input
          pInputText
          class="w-full"
          placeholder="Buscar usuario por nombre, correo, dirección o teléfono..."
          [value]="searchTerm()"
          (input)="onSearch($event)"
        />
      </div>

      <p-table
        [value]="filteredUsers()"
        [loading]="loading()"
        [paginator]="true"
        [rows]="10"
        [rowHover]="true"
        dataKey="id"
        responsiveLayout="scroll"
      >
        <ng-template #header>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Fecha de nacimiento</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Creado</th>
            <th style="width: 12rem">Acciones</th>
          </tr>
        </ng-template>

        <ng-template #body let-user>
          <tr>
            <td>
              <img [src]="avatarService.resolve(user.foto, user.name)" alt="Foto de {{ user.name }}" width="44" height="44" style="border-radius: 50%; object-fit: cover" />
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.lastname }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.birthdate | date: 'short' }}</td>
            <td>{{ user.email }}</td>
            <td>
              <p-tag [value]="user.role" severity="info" />
            </td>
            <td>
              <p-tag
                [value]="user.isActive ? 'Activo' : 'Inactivo'"
                [severity]="user.isActive ? 'success' : 'danger'"
              />
            </td>
            <td>{{ user.createdAt | date: 'short' }}</td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  icon="pi pi-pencil"
                  severity="secondary"
                  rounded
                  text
                  (click)="openEdit(user)"
                ></button>

                <button
                  pButton
                  [icon]="user.isActive ? 'pi pi-ban' : 'pi pi-check'"
                  [severity]="user.isActive ? 'danger' : 'success'"
                  rounded
                  text
                  (click)="toggleActive(user)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
      </div>
      </div>
    </div>

    <p-dialog
      [(visible)]="dialogVisible"
      [modal]="true"
      [style]="{ width: '44rem' }"
      [header]="editingUserId ? 'Editar usuario' : 'Crear usuario'"
    >
      <form class="grid grid-cols-2 gap-4" [formGroup]="form" (ngSubmit)="save()">
        <div>
          <label class="mb-2 block font-medium" for="name">Nombre</label>
          <input id="name" pInputText class="w-full" formControlName="name" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="lastname">Apellido</label>
          <input id="lastname" pInputText class="w-full" formControlName="lastname" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="address">Dirección</label>
          <input id="address" pInputText class="w-full" formControlName="address" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="phone">Teléfono</label>
          <input id="phone" pInputText class="w-full" formControlName="phone" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="birthdate">Fecha de nacimiento</label>
          <input id="birthdate" type="date" pInputText class="w-full" formControlName="birthdate" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="email">Correo</label>
          <input id="email" type="email" pInputText class="w-full" formControlName="email" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="foto">Foto (URL)</label>
          <input id="foto" type="url" pInputText class="w-full" formControlName="foto" />
          <input type="file" accept="image/*" class="mt-2 block w-full text-sm" (change)="onFileSelected($event)" />
          @if (form.controls.foto.value) {
            <img [src]="form.controls.foto.value" alt="Vista previa" width="64" height="64" style="border-radius: 12px; object-fit: cover" class="mt-2" />
          }
        </div>

        @if (!editingUserId) {
          <div>
            <label class="mb-2 block font-medium" for="password">Contraseña</label>
            <p-password
              inputId="password"
              styleClass="w-full"
              inputStyleClass="w-full"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
            />
          </div>
        }

        <div>
          <label class="mb-2 block font-medium" for="role">Rol</label>
          <p-select
            inputId="role"
            styleClass="w-full"
            formControlName="role"
            [options]="roles"
          />
        </div>

        <div class="col-span-2 flex justify-end gap-2">
          <button
            pButton
            type="button"
            label="Cancelar"
            severity="secondary"
            (click)="dialogVisible = false"
          ></button>
          <button pButton type="submit" label="Guardar" [loading]="saving"></button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class UsersPage implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly confirmationService = inject(ConfirmationService);
  protected readonly avatarService = inject(AvatarService);

  users = signal<User[]>([]);
  searchTerm = signal('');
  loading = signal(false);
  dialogVisible = false;
  saving = false;
  editingUserId: string | null = null;

  roles: UserRole[] = ['ADMIN', 'USER', 'SUPERVISOR'];

  // Formulario compartido para crear y editar.
  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: [''],
    address: [''],
    phone: [''],
    birthdate: [''],
    email: ['', [Validators.required, Validators.email]],
    foto: [''],
    password: ['', [Validators.minLength(8)]],
    role: ['USER' as UserRole, [Validators.required]],
  });

  ngOnInit() {
    this.loadUsers();
  }

  // Búsqueda del lado del cliente (JS/TS).
  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.users();

    if (!term) {
      return list;
    }

    return list.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.lastname?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.address?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term),
    );
  });

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  // Carga una imagen desde el equipo y la guarda como data URL en el campo foto.
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.form.controls.foto.setValue(reader.result as string);
    reader.readAsDataURL(file);
  }

  loadUsers() {
    this.loading.set(true);

    this.usersService.findMany().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.showError(error);
      },
    });
  }

  openCreate() {
    this.editingUserId = null;
    this.form.reset({
      name: '',
      lastname: '',
      address: '',
      phone: '',
      birthdate: '',
      foto: '',
      email: '',
      password: '',
      role: 'USER',
    });
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.controls.password.updateValueAndValidity();
    this.dialogVisible = true;
  }

  openEdit(user: User) {
    this.editingUserId = user.id;
    this.form.reset({
      name: user.name,
      lastname: user.lastname ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
      birthdate: user.birthdate ?? '',
      foto: user.foto ?? '',
      email: user.email,
      password: '',
      role: user.role,
    });
    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();

    if (this.editingUserId) {
      this.usersService
        .update(this.editingUserId, {
          name: value.name,
          lastname: value.lastname,
          address: value.address,
          phone: value.phone,
          birthdate: value.birthdate,
          email: value.email,
          foto: value.foto,
          role: value.role,
        })
        .subscribe({
          next: () => this.afterSave('Usuario actualizado correctamente'),
          error: (error) => this.afterError(error),
        });

      return;
    }

    this.usersService
      .create({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
        foto: value.foto,
      })
      .subscribe({
        next: () => this.afterSave('Usuario creado correctamente'),
        error: (error) => this.afterError(error),
      });
  }

  toggleActive(user: User) {
    const activar = !user.isActive;

    this.confirmationService.confirm({
      header: activar ? 'Activar usuario' : 'Desactivar usuario',
      message: activar
        ? `¿Quieres activar de nuevo a ${user.name}?`
        : `¿Quieres desactivar a ${user.name}?`,
      icon: activar ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (activar) {
          this.usersService.update(user.id, { isActive: true }).subscribe({
            next: () => this.afterSave('Usuario activado correctamente'),
            error: (error) => this.showError(error),
          });
        } else {
          this.usersService.deactivate(user.id).subscribe({
            next: () => this.afterSave('Usuario desactivado correctamente'),
            error: (error) => this.showError(error),
          });
        }
      },
    });
  }

  private afterSave(message: string) {
    this.saving = false;
    this.dialogVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Operación exitosa',
      detail: message,
    });
    this.loadUsers();
  }

  private afterError(error: unknown) {
    this.saving = false;
    this.showError(error);
  }

  private showError(error: unknown) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.apiErrorService.getMessage(error),
    });
  }
}