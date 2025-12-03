export interface Profesional {
  id?: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  password?: string;
  profesion: string;
  tipoTerapia: string;
  activo?: boolean;
}

