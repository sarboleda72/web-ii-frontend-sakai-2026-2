// Herramienta que devuelve el backend.
export type Herramienta = {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  stock: number;
  disponible: boolean;
  foto?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateHerramientaRequest = {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  stock?: number;
  disponible?: boolean;
  foto?: string;
};

export type UpdateHerramientaRequest = {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  stock?: number;
  disponible?: boolean;
  foto?: string;
};
