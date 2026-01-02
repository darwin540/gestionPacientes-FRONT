import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { TipoTerapiaRequest, TipoTerapiaResponse, TipoTerapiaUpdate } from '../models/tipo-terapia.model';

@Injectable({
  providedIn: 'root'
})
export class TipoTerapiaService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/tipos-terapia`;

  crearTipoTerapia(tipoTerapia: TipoTerapiaRequest): Observable<TipoTerapiaResponse> {
    return this.http.post<TipoTerapiaResponse>(this.apiUrl, tipoTerapia);
  }

  obtenerTipoTerapiaPorId(id: number): Observable<TipoTerapiaResponse> {
    return this.http.get<TipoTerapiaResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodosLosTiposTerapia(): Observable<TipoTerapiaResponse[]> {
    return this.http.get<TipoTerapiaResponse[]>(this.apiUrl);
  }

  actualizarTipoTerapia(id: number, tipoTerapia: TipoTerapiaUpdate): Observable<TipoTerapiaResponse> {
    return this.http.put<TipoTerapiaResponse>(`${this.apiUrl}/${id}`, tipoTerapia);
  }

  eliminarTipoTerapia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


