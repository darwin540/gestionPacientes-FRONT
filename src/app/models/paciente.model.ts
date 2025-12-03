export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  tipoDocumentoId: number;
  tipoDocumentoNombre?: string;
  numeroDocumento: string;
}

export interface ProfesionalPacientes {
  profesionalId: number;
  profesionalNombre: string;
  profesionalApellido: string;
  profesionalNombreUsuario: string;
  profesionalProfesion: string;
  profesionalTipoTerapia: string;
  pacientes: Paciente[];
}

