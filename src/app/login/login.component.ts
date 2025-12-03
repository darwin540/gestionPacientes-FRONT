import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profesionales']);
    }
  }

  onSubmit(): void {
    if (!this.loginRequest.username || !this.loginRequest.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirigir según el rol
        if (response.roles.includes('ADMIN')) {
          this.router.navigate(['/profesionales']);
        } else {
          this.router.navigate(['/terapias']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.mensaje || 'Usuario o contraseña incorrectos';
      }
    });
  }
}

