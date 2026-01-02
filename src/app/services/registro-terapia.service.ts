import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { RegistroTerapiaRequest, RegistroTerapiaResponse, RegistroTerapiaUpdate } from '../models/registro-terapia.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroTerapiaService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/registros-terapia`;

  crearRegistros(registro: RegistroTerapiaRequest): Observable<RegistroTerapiaResponse[]> {
    return this.http.post<RegistroTerapiaResponse[]>(this.apiUrl, registro);
  }

  obtenerRegistroPorId(id: number): Observable<RegistroTerapiaResponse> {
    return this.http.get<RegistroTerapiaResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerRegistrosPorPaciente(pacienteId: number): Observable<RegistroTerapiaResponse[]> {
    return this.http.get<RegistroTerapiaResponse[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  actualizarRegistro(id: number, registro: RegistroTerapiaUpdate): Observable<RegistroTerapiaResponse> {
    return this.http.put<RegistroTerapiaResponse>(`${this.apiUrl}/${id}`, registro);
  }

  eliminarRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}



