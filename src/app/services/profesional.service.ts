import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ProfesionalRequest, ProfesionalResponse, ProfesionalUpdate } from '../models/profesional.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/profesionales`;

  crearProfesional(profesional: ProfesionalRequest): Observable<ProfesionalResponse> {
    return this.http.post<ProfesionalResponse>(this.apiUrl, profesional);
  }

  obtenerProfesionalPorId(id: number): Observable<ProfesionalResponse> {
    return this.http.get<ProfesionalResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodosLosProfesionales(): Observable<ProfesionalResponse[]> {
    return this.http.get<ProfesionalResponse[]>(this.apiUrl);
  }

  actualizarProfesional(id: number, profesional: ProfesionalUpdate): Observable<ProfesionalResponse> {
    return this.http.put<ProfesionalResponse>(`${this.apiUrl}/${id}`, profesional);
  }

  eliminarProfesional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  asignarTiposTerapia(id: number, tiposTerapiaIds: number[]): Observable<ProfesionalResponse> {
    return this.http.post<ProfesionalResponse>(`${this.apiUrl}/${id}/tipos-terapia`, tiposTerapiaIds);
  }

  quitarTiposTerapia(id: number, tiposTerapiaIds: number[]): Observable<ProfesionalResponse> {
    return this.http.delete<ProfesionalResponse>(`${this.apiUrl}/${id}/tipos-terapia`, { body: tiposTerapiaIds });
  }
}


