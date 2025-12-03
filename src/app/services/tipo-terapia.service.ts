import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoTerapia {
  id?: number;
  nombre: string;
  valorUnitario: number;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TipoTerapiaService {
  private apiUrl = 'http://localhost:8080/api/tipos-terapia';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TipoTerapia[]> {
    return this.http.get<TipoTerapia[]>(this.apiUrl);
  }

  getActivos(): Observable<TipoTerapia[]> {
    return this.http.get<TipoTerapia[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<TipoTerapia> {
    return this.http.get<TipoTerapia>(`${this.apiUrl}/${id}`);
  }

  create(tipoTerapia: TipoTerapia): Observable<TipoTerapia> {
    return this.http.post<TipoTerapia>(this.apiUrl, tipoTerapia);
  }

  update(id: number, tipoTerapia: TipoTerapia): Observable<TipoTerapia> {
    return this.http.put<TipoTerapia>(`${this.apiUrl}/${id}`, tipoTerapia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

