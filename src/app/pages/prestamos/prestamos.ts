import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiErrorService } from '../../core/services/api-error.service';
import { PrestamosService } from '../../core/services/prestamos.service';
import { UsersService } from '../../core/services/users.service';
import { HerramientasService } from '../../core/services/herramientas.service';
import type { Prestamo } from '../../core/models/prestamo.models';
import type { User } from '../../core/models/user.models';
import type { Herramienta } from '../../core/models/herramienta.models';

@Component({
  selector: 'app-prestamos-page',
  standalone: true,
  imports: [ButtonModule, DatePipe, DialogModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, ToastModule, ToolbarModule, ConfirmDialogModule],
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
    :host ::ng-deep .p-dialog { background: rgba(2, 6, 23, 0.97); color: #f8fafc; border: 1px solid rgba(134, 239, 172, 0.3); border-radius: 18px; }
    :host ::ng-deep .p-dialog .p-dialog-header { background: linear-gradient(90deg, #052e16, #14532d); color: #ecfdf5; border-radius: 18px 18px 0 0; }
  `],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="tools-screen">
      <div class="tools-panel">
        <p-toolbar styleClass="mb-4">
          <ng-template #start>
            <div>
              <h2 class="m-0 text-2xl font-semibold">Préstamos</h2>
              <p class="m-0">Usuarios que realizan préstamos de herramientas</p>
            </div>
          </ng-template>
          <ng-template #end>
            <button pButton label="Nuevo" icon="pi pi-plus" (click)="openCreate()"></button>
          </ng-template>
        </p-toolbar>

        <div class="mb-4">
          <input pInputText class="w-full" placeholder="Buscar por usuario, herramienta o estado..." [value]="searchTerm()" (input)="onSearch($event)" />
        </div>

        <p-table [value]="filteredPrestamos()" [loading]="loading()" [paginator]="true" [rows]="10" [rowHover]="true" dataKey="id" responsiveLayout="scroll">
          <ng-template #header>
            <tr>
              <th>Usuario</th>
              <th>Herramienta</th>
              <th>Fecha préstamo</th>
              <th>Devolución</th>
              <th>Estado</th>
              <th style="width: 12rem">Acciones</th>
            </tr>
          </ng-template>
          <ng-template #body let-prestamo>
            <tr>
              <td>{{ prestamo.usuario?.name }} {{ prestamo.usuario?.lastname }}</td>
              <td>{{ prestamo.herramienta?.nombre }}</td>
              <td>{{ prestamo.fechaPrestamo | date: 'short' }}</td>
              <td>{{ prestamo.fechaDevolucion ? (prestamo.fechaDevolucion | date: 'short') : '—' }}</td>
              <td>
                <p-tag [value]="prestamo.estado" [severity]="prestamo.estado === 'ACTIVO' ? 'warn' : 'success'" />
              </td>
              <td>
                <button pButton icon="pi pi-check" severity="success" rounded text [disabled]="prestamo.estado !== 'ACTIVO'" (click)="devolver(prestamo)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="dialogVisible" [modal]="true" [style]="{ width: '44rem' }" header="Nuevo préstamo">
      <form class="grid grid-cols-1 gap-4" [formGroup]="form" (ngSubmit)="save()">
        <div>
          <label class="mb-2 block font-medium">Usuario</label>
          <p-select styleClass="w-full" formControlName="usuarioId" [options]="usuarios()" optionLabel="label" optionValue="value" placeholder="Selecciona un usuario" />
        </div>
        <div>
          <label class="mb-2 block font-medium">Herramienta</label>
          <p-select styleClass="w-full" formControlName="herramientaId" [options]="herramientas()" optionLabel="label" optionValue="value" placeholder="Selecciona una herramienta" />
        </div>
        <div class="flex justify-end gap-2">
          <button pButton type="button" label="Cancelar" severity="secondary" (click)="dialogVisible = false"></button>
          <button pButton type="submit" label="Guardar" [loading]="saving"></button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class PrestamosPage implements OnInit {
  private readonly prestamosService = inject(PrestamosService);
  private readonly usersService = inject(UsersService);
  private readonly herramientasService = inject(HerramientasService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly confirmationService = inject(ConfirmationService);

  prestamos = signal<Prestamo[]>([]);
  usuarios = signal<{ label: string; value: string }[]>([]);
  herramientas = signal<{ label: string; value: string }[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  dialogVisible = false;
  saving = false;

  filteredPrestamos = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.prestamos();

    if (!term) {
      return list;
    }

    return list.filter(
      (p) =>
        p.usuario?.name?.toLowerCase().includes(term) ||
        p.usuario?.email?.toLowerCase().includes(term) ||
        p.herramienta?.nombre?.toLowerCase().includes(term) ||
        p.estado?.toLowerCase().includes(term),
    );
  });

  form = this.formBuilder.nonNullable.group({
    usuarioId: ['', Validators.required],
    herramientaId: ['', Validators.required],
  });

  ngOnInit() {
    this.load();
    this.usersService.findMany().subscribe({
      next: (users: User[]) => this.usuarios.set(users.map((u) => ({ label: `${u.name} ${u.lastname ?? ''} (${u.email})`, value: u.id }))),
    });
    this.herramientasService.findMany().subscribe({
      next: (hs: Herramienta[]) => this.herramientas.set(hs.map((h) => ({ label: `${h.nombre} (${h.categoria ?? 'Sin categoría'})`, value: h.id }))),
    });
  }

  load() {
    this.loading.set(true);
    this.prestamosService.findMany().subscribe({
      next: (prestamos) => {
        this.prestamos.set(prestamos);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.showError(error);
      },
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  openCreate() {
    this.form.reset({ usuarioId: '', herramientaId: '' });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    this.prestamosService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.dialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Préstamo creado' });
        this.load();
      },
      error: (error) => {
        this.saving = false;
        this.showError(error);
      },
    });
  }

  devolver(prestamo: Prestamo) {
    this.confirmationService.confirm({
      header: 'Devolver herramienta',
      message: `¿Confirmas la devolución de "${prestamo.herramienta?.nombre}" por ${prestamo.usuario?.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.prestamosService.devolver(prestamo.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Préstamo devuelto' });
            this.load();
          },
          error: (error) => this.showError(error),
        });
      },
    });
  }

  private showError(error: unknown) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.apiErrorService.getMessage(error) });
  }
}
