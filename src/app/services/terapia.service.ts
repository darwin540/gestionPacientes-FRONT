import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Terapia {
  id?: number;
  pacienteId: number;
  profesionalId: number;
  fecha: string;
  servicioDepartamentoId: number;
  servicioDepartamentoNombre?: string;
  servicioDepartamentoAbreviacion?: string;
  pacienteNombre?: string;
  pacienteApellido?: string;
  profesionalNombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TerapiaService {
  private apiUrl = 'http://localhost:8080/api/terapias';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Terapia[]> {
    return this.http.get<Terapia[]>(this.apiUrl);
  }

  getById(id: number): Observable<Terapia> {
    return this.http.get<Terapia>(`${this.apiUrl}/${id}`);
  }

  getByPacienteId(pacienteId: number): Observable<Terapia[]> {
    return this.http.get<Terapia[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getByProfesionalId(profesionalId: number): Observable<Terapia[]> {
    return this.http.get<Terapia[]>(`${this.apiUrl}/profesional/${profesionalId}`);
  }

  create(terapia: Terapia): Observable<Terapia> {
    return this.http.post<Terapia>(this.apiUrl, terapia);
  }

  update(id: number, terapia: Terapia): Observable<Terapia> {
    return this.http.put<Terapia>(`${this.apiUrl}/${id}`, terapia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

