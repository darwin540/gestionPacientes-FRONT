import { TipoDocumento } from './tipo-documento.enum';

export interface PacienteRequest {
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  documento: string;
}

export interface PacienteResponse {
  id: number;
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PacienteUpdate {
  nombre?: string;
  apellido?: string;
  tipoDocumento?: TipoDocumento;
  documento?: string;
}



