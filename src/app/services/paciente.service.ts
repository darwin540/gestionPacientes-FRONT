import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { PacienteRequest, PacienteResponse, PacienteUpdate } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/pacientes`;

  crearPaciente(paciente: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.apiUrl, paciente);
  }

  obtenerPacientePorId(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodosLosPacientes(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.apiUrl);
  }

  actualizarPaciente(id: number, paciente: PacienteUpdate): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


