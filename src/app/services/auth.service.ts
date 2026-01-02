import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('profesionalId', response.profesionalId.toString());
          localStorage.setItem('nombreProfesional', response.nombreProfesional);
          // Determinar si es admin (por ahora basado en username, puede cambiarse)
          const isAdmin = credentials.username.toLowerCase() === 'admin' || 
                         response.email?.toLowerCase().includes('admin');
          localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('profesionalId');
    localStorage.removeItem('nombreProfesional');
    localStorage.removeItem('isAdmin');
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getProfesionalId(): number | null {
    const id = localStorage.getItem('profesionalId');
    return id ? parseInt(id, 10) : null;
  }

  getNombreProfesional(): string | null {
    return localStorage.getItem('nombreProfesional');
  }
}

