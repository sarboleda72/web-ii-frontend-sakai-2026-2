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
import { HerramientasService } from '../../core/services/herramientas.service';
import { AvatarService } from '../../core/services/avatar.service';
import type { Herramienta } from '../../core/models/herramienta.models';

@Component({
  selector: 'app-herramientas-page',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  styles: [`
    .tools-screen {
      display: grid;
      gap: 1.25rem;
      color: #e5e7eb;
      padding: clamp(0.25rem, 1vw, 0.75rem);
    }

    .tools-panel {
      position: relative;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background:
        linear-gradient(135deg, rgba(2, 6, 23, 0.94), rgba(15, 23, 42, 0.9)),
        url('/fondo.jpg') center/cover no-repeat;
      box-shadow: 0 18px 45px rgba(2, 6, 23, 0.18);
      padding: clamp(1.25rem, 3vw, 2.25rem);
      border-radius: 18px;
    }

    h2 {
      color: #f8fafc;
    }

    .tools-panel p {
      color: #86efac;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      min-height: 3rem;
      border: 1px solid rgba(148, 163, 184, 0.26);
      border-left: 4px solid #86efac;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.82));
      color: #f8fafc;
      border-radius: 12px;
      padding: 0 1rem;
      outline: 0;
    }

    input:focus {
      border-color: rgba(134, 239, 172, 0.9);
      box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.12);
    }

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
            <h2 class="m-0 text-2xl font-semibold">Herramientas</h2>
            <p class="m-0 text-surface-500">Administración básica de herramientas</p>
          </div>
        </ng-template>

        <ng-template #end>
          <button pButton label="Nueva" icon="pi pi-plus" (click)="openCreate()"></button>
        </ng-template>
      </p-toolbar>

      <div class="mb-4">
        <input
          pInputText
          class="w-full"
          placeholder="Buscar herramienta por nombre, descripción o categoría..."
          [value]="searchTerm()"
          (input)="onSearch($event)"
        />
      </div>

      <p-table
        [value]="filteredHerramientas()"
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
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Creado</th>
            <th style="width: 12rem">Acciones</th>
          </tr>
        </ng-template>

        <ng-template #body let-herramienta>
          <tr>
            <td>
              <img [src]="avatarService.resolve(herramienta.foto, herramienta.nombre)" alt="Foto de {{ herramienta.nombre }}" width="44" height="44" style="border-radius: 12px; object-fit: cover" />
            </td>
            <td>{{ herramienta.nombre }}</td>
            <td>{{ herramienta.descripcion }}</td>
            <td>{{ herramienta.categoria }}</td>
            <td>{{ herramienta.stock }}</td>
            <td>
              <p-tag
                [value]="herramienta.disponible ? 'Disponible' : 'No disponible'"
                [severity]="herramienta.disponible ? 'success' : 'danger'"
              />
            </td>
            <td>{{ herramienta.createdAt | date: 'short' }}</td>
            <td>
              <div class="flex gap-2">
                <button pButton icon="pi pi-pencil" severity="secondary" rounded text (click)="openEdit(herramienta)"></button>
                <button
                  pButton
                  [icon]="herramienta.disponible ? 'pi pi-ban' : 'pi pi-check'"
                  [severity]="herramienta.disponible ? 'danger' : 'success'"
                  rounded
                  text
                  (click)="toggleDisponible(herramienta)"
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
      [style]="{ width: '40rem' }"
      [header]="editingId ? 'Editar herramienta' : 'Crear herramienta'"
    >
      <form class="grid grid-cols-2 gap-4" [formGroup]="form" (ngSubmit)="save()">
        <div>
          <label class="mb-2 block font-medium" for="nombre">Nombre</label>
          <input id="nombre" pInputText class="w-full" formControlName="nombre" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="descripcion">Descripción</label>
          <input id="descripcion" pInputText class="w-full" formControlName="descripcion" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="categoria">Categoría</label>
          <input id="categoria" pInputText class="w-full" formControlName="categoria" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="stock">Stock</label>
          <input id="stock" type="number" pInputText class="w-full" formControlName="stock" />
        </div>

        <div>
          <label class="mb-2 block font-medium" for="foto">Foto (URL)</label>
          <input id="foto" type="url" pInputText class="w-full" formControlName="foto" />
          <input type="file" accept="image/*" class="mt-2 block w-full text-sm" (change)="onFileSelected($event)" />
          @if (form.controls.foto.value) {
            <img [src]="form.controls.foto.value" alt="Vista previa" width="64" height="64" style="border-radius: 12px; object-fit: cover" class="mt-2" />
          }
        </div>

        <div>
          <label class="mb-2 block font-medium" for="disponible">Estado</label>
          <p-select
            inputId="disponible"
            styleClass="w-full"
            formControlName="disponible"
            [options]="estados"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div class="col-span-2 flex justify-end gap-2">
          <button pButton type="button" label="Cancelar" severity="secondary" (click)="dialogVisible = false"></button>
          <button pButton type="submit" label="Guardar" [loading]="saving"></button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class HerramientasPage implements OnInit {
  private readonly herramientasService = inject(HerramientasService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly confirmationService = inject(ConfirmationService);
  protected readonly avatarService = inject(AvatarService);

  herramientas = signal<Herramienta[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  dialogVisible = false;
  saving = false;
  editingId: string | null = null;

  estados = [
    { label: 'Disponible', value: true },
    { label: 'No disponible', value: false },
  ];

  // Búsqueda del lado del cliente (JS/TS) sobre la lista cargada.
  filteredHerramientas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.herramientas();

    if (!term) {
      return list;
    }

    return list.filter(
      (h) =>
        h.nombre?.toLowerCase().includes(term) ||
        h.descripcion?.toLowerCase().includes(term) ||
        h.categoria?.toLowerCase().includes(term),
    );
  });

  form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    categoria: [''],
    stock: [0, [Validators.min(0)]],
    foto: [''],
    disponible: [true],
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);

    this.herramientasService.findMany().subscribe({
      next: (herramientas) => {
        this.herramientas.set(herramientas);
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

  openCreate() {
    this.editingId = null;
    this.form.reset({ nombre: '', descripcion: '', categoria: '', stock: 0, disponible: true, foto: '' });
    this.dialogVisible = true;
  }

  openEdit(herramienta: Herramienta) {
    this.editingId = herramienta.id;
    this.form.reset({
      nombre: herramienta.nombre,
      descripcion: herramienta.descripcion ?? '',
      categoria: herramienta.categoria ?? '',
      stock: herramienta.stock,
      disponible: herramienta.disponible,
      foto: herramienta.foto ?? '',
    });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();

    const request$ = this.editingId
      ? this.herramientasService.update(this.editingId, value)
      : this.herramientasService.create(value);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Herramienta guardada' });
        this.load();
      },
      error: (error) => {
        this.saving = false;
        this.showError(error);
      },
    });
  }

  toggleDisponible(herramienta: Herramienta) {
    const activar = !herramienta.disponible;

    this.confirmationService.confirm({
      header: activar ? 'Activar herramienta' : 'Desactivar herramienta',
      message: activar
        ? `¿Quieres marcar "${herramienta.nombre}" como disponible?`
        : `¿Quieres marcar "${herramienta.nombre}" como no disponible?`,
      icon: activar ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      accept: () => {
        const request$ = activar
          ? this.herramientasService.update(herramienta.id, { disponible: true })
          : this.herramientasService.deactivate(herramienta.id);

        request$.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Listo',
              detail: activar ? 'Herramienta activada' : 'Herramienta desactivada',
            });
            this.load();
          },
          error: (error) => this.showError(error),
        });
      },
    });
  }

  private showError(error: unknown) {
    const message = this.apiErrorService.getMessage(error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
