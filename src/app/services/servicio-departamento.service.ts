import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServicioDepartamento {
  id?: number;
  abreviacion: string;
  nombre: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioDepartamentoService {
  private apiUrl = 'http://localhost:8080/api/servicios-departamentos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ServicioDepartamento[]> {
    return this.http.get<ServicioDepartamento[]>(this.apiUrl);
  }

  getActivos(): Observable<ServicioDepartamento[]> {
    return this.http.get<ServicioDepartamento[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<ServicioDepartamento> {
    return this.http.get<ServicioDepartamento>(`${this.apiUrl}/${id}`);
  }

  create(servicioDepartamento: ServicioDepartamento): Observable<ServicioDepartamento> {
    return this.http.post<ServicioDepartamento>(this.apiUrl, servicioDepartamento);
  }

  update(id: number, servicioDepartamento: ServicioDepartamento): Observable<ServicioDepartamento> {
    return this.http.put<ServicioDepartamento>(`${this.apiUrl}/${id}`, servicioDepartamento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

