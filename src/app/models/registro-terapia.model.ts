export interface RegistroTerapiaItem {
  fecha: string;
  servicioAbreviatura: string;
  numeroSesiones: number;
}

export interface RegistroTerapiaRequest {
  pacienteId: number;
  registros: RegistroTerapiaItem[];
}

export interface RegistroTerapiaResponse {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  profesionalId: number;
  profesionalNombre: string;
  tipoTerapiaId: number;
  tipoTerapiaNombre: string;
  servicioId: number;
  servicioNombreCompleto: string;
  servicioAbreviatura: string;
  fecha: string;
  numeroSesiones: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface RegistroTerapiaUpdate {
  fecha?: string;
  servicioAbreviatura?: string;
  numeroSesiones?: number;
}


