import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombreProfesional: string | null = this.authService.getNombreProfesional();
  isAdmin: boolean = this.authService.isAdmin();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

