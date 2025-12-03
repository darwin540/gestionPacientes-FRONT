import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoDocumento {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  private apiUrl = 'http://localhost:8080/api/tipos-documento';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.apiUrl);
  }

  getActivos(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<TipoDocumento> {
    return this.http.get<TipoDocumento>(`${this.apiUrl}/${id}`);
  }

  create(tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(this.apiUrl, tipoDocumento);
  }

  update(id: number, tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.put<TipoDocumento>(`${this.apiUrl}/${id}`, tipoDocumento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

