import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profesional } from '../models/profesional.model';
import { ProfesionalService } from '../services/profesional.service';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-profesionales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './profesionales.component.html',
  styleUrl: './profesionales.component.css'
})
export class ProfesionalesComponent implements OnInit {
  profesionales: Profesional[] = [];
  profesional: Profesional = {
    nombre: '',
    nombreUsuario: '',
    profesion: '',
    tipoTerapia: '',
    valorPorTerapia: 0
  };
  isEditing = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private profesionalService: ProfesionalService,
    private authService: AuthService
  ) { }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProfesionales();
  }

  loadProfesionales(): void {
    this.profesionalService.getAll().subscribe({
      next: (data) => {
        this.profesionales = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar profesionales:', error);
        this.errorMessage = 'Error al cargar los profesionales';
        this.successMessage = '';
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.profesional = {
      nombre: '',
      nombreUsuario: '',
      profesion: '',
      tipoTerapia: '',
      valorPorTerapia: 0
    };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditForm(profesional: Profesional): void {
    this.isEditing = true;
    this.profesional = { ...profesional };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  save(form: NgForm): void {
    if (form.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    if (this.isEditing && this.profesional.id) {
      this.updateProfesional();
    } else {
      this.createProfesional();
    }
  }

  createProfesional(): void {
    this.profesionalService.create(this.profesional).subscribe({
      next: () => {
        this.successMessage = 'Profesional creado exitosamente';
        this.errorMessage = '';
        this.loadProfesionales();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error al crear profesional:', error);
        this.errorMessage = error.error?.mensaje || 'Error al crear el profesional';
        this.successMessage = '';
      }
    });
  }

  updateProfesional(): void {
    if (this.profesional.id) {
      this.profesionalService.update(this.profesional.id, this.profesional).subscribe({
        next: () => {
          this.successMessage = 'Profesional actualizado exitosamente';
          this.errorMessage = '';
          this.loadProfesionales();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar profesional:', error);
          this.errorMessage = error.error?.mensaje || 'Error al actualizar el profesional';
          this.successMessage = '';
        }
      });
    }
  }

  deleteProfesional(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este profesional?')) {
      this.profesionalService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Profesional eliminado exitosamente';
          this.errorMessage = '';
          this.loadProfesionales();
        },
        error: (error) => {
          console.error('Error al eliminar profesional:', error);
          this.errorMessage = error.error?.mensaje || 'Error al eliminar el profesional';
          this.successMessage = '';
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  }
}

