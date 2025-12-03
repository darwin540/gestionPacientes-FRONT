import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesional } from '../models/profesional.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  private apiUrl = 'http://localhost:8080/api/profesionales';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(this.apiUrl);
  }

  getById(id: number): Observable<Profesional> {
    return this.http.get<Profesional>(`${this.apiUrl}/${id}`);
  }

  create(profesional: Profesional): Observable<Profesional> {
    return this.http.post<Profesional>(this.apiUrl, profesional);
  }

  update(id: number, profesional: Profesional): Observable<Profesional> {
    return this.http.put<Profesional>(`${this.apiUrl}/${id}`, profesional);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

