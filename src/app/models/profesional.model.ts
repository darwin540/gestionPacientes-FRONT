import { TipoTerapiaResponse } from './tipo-terapia.model';

export interface ProfesionalRequest {
  nombre: string;
  profesion: string;
  numeroCuentaBanco: string;
  nombreBanco: string;
  email: string;
  username: string;
  password: string;
  tiposTerapiaIds?: number[];
}

export interface ProfesionalResponse {
  id: number;
  nombre: string;
  profesion: string;
  numeroCuentaBanco: string;
  nombreBanco: string;
  tiposTerapia: TipoTerapiaResponse[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProfesionalUpdate {
  nombre?: string;
  profesion?: string;
  numeroCuentaBanco?: string;
  nombreBanco?: string;
  email?: string;
}



