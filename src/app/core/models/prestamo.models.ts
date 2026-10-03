export type PrestamoUsuario = {
  id: string;
  name: string;
  lastname?: string;
  email: string;
};

export type PrestamoHerramienta = {
  id: string;
  nombre: string;
  categoria?: string;
};

export type Prestamo = {
  id: string;
  usuarioId: string;
  herramientaId: string;
  usuario: PrestamoUsuario;
  herramienta: PrestamoHerramienta;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  estado: 'ACTIVO' | 'DEVUELTO';
  createdAt: string;
  updatedAt: string;
};

export type CreatePrestamoRequest = {
  usuarioId: string;
  herramientaId: string;
  fechaPrestamo?: string;
};

export type UpdatePrestamoRequest = {
  usuarioId?: string;
  herramientaId?: string;
  fechaPrestamo?: string;
  fechaDevolucion?: string;
  estado?: 'ACTIVO' | 'DEVUELTO';
};
