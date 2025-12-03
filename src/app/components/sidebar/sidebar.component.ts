import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  
  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}

