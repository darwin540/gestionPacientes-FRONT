import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ServicioRequest, ServicioResponse, ServicioUpdate } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/servicios`;

  crearServicio(servicio: ServicioRequest): Observable<ServicioResponse> {
    return this.http.post<ServicioResponse>(this.apiUrl, servicio);
  }

  obtenerServicioPorId(id: number): Observable<ServicioResponse> {
    return this.http.get<ServicioResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodosLosServicios(): Observable<ServicioResponse[]> {
    return this.http.get<ServicioResponse[]>(this.apiUrl);
  }

  actualizarServicio(id: number, servicio: ServicioUpdate): Observable<ServicioResponse> {
    return this.http.put<ServicioResponse>(`${this.apiUrl}/${id}`, servicio);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


