export interface TipoTerapiaRequest {
  nombre: string;
  valorUnitario: number;
}

export interface TipoTerapiaResponse {
  id: number;
  nombre: string;
  valorUnitario: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface TipoTerapiaUpdate {
  nombre?: string;
  valorUnitario?: number;
}



