import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, ProfesionalPacientes } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/pacientes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  getPacientesPorProfesional(): Observable<ProfesionalPacientes[]> {
    return this.http.get<ProfesionalPacientes[]>(`${this.apiUrl}/por-profesional`);
  }

  searchByDocumento(documento: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/documento/${documento}`);
  }

  searchByNombreAndApellido(nombre?: string, apellido?: string): Observable<Paciente[]> {
    const params: any = {};
    if (nombre) params.nombre = nombre;
    if (apellido) params.apellido = apellido;
    return this.http.get<Paciente[]>(`${this.apiUrl}/buscar`, { params });
  }

  create(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  update(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

