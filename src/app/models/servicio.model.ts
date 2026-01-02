export interface ServicioRequest {
  nombreCompleto: string;
  abreviatura: string;
}

export interface ServicioResponse {
  id: number;
  nombreCompleto: string;
  abreviatura: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ServicioUpdate {
  nombreCompleto?: string;
  abreviatura?: string;
}


