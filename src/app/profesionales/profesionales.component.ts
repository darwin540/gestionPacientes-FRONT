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
    apellido: '',
    nombreUsuario: '',
    password: '',
    profesion: '',
    tipoTerapia: '',
    activo: true
  };
  
  tiposTerapia: string[] = []; // Se cargará desde el backend cuando esté disponible
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
    this.loadTiposTerapia(); // Cargar tipos de terapia (cuando esté disponible)
  }

  loadTiposTerapia(): void {
    // TODO: Cuando esté disponible el servicio de terapias, cargar aquí
    // Por ahora, dejamos el array vacío o con valores de ejemplo si es necesario
    this.tiposTerapia = [];
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
      apellido: '',
      nombreUsuario: '',
      password: '',
      profesion: '',
      tipoTerapia: '',
      activo: true
    };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditForm(profesional: Profesional): void {
    this.isEditing = true;
    this.profesional = { 
      ...profesional,
      password: '' // No mostrar contraseña al editar
    };
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
    // Validar que los campos requeridos estén completos
    const requiredFields = ['nombre', 'apellido', 'nombreUsuario', 'profesion', 'tipoTerapia'];
    
    // La contraseña solo es requerida al crear
    if (!this.isEditing) {
      requiredFields.push('password');
    }

    // Marcar campos como touched
    requiredFields.forEach(field => {
      const control = form.controls[field];
      if (control) {
        control.markAsTouched();
      }
    });

    // Verificar validez excluyendo password si estamos editando y no se ingresó
    if (this.isEditing && (!this.profesional.password || this.profesional.password.trim() === '')) {
      // Remover el control de password de la validación
      const passwordControl = form.controls['password'];
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }

    if (form.invalid) {
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
    // Normalizar datos antes de enviar
    const profesionalToSave = {
      ...this.profesional,
      nombreUsuario: this.profesional.nombreUsuario.toUpperCase().trim(),
      password: this.profesional.password?.toLowerCase().trim() || ''
    };
    
    this.profesionalService.create(profesionalToSave).subscribe({
      next: () => {
        this.successMessage = 'Profesional creado exitosamente';
        this.errorMessage = '';
        this.loadProfesionales();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error al crear profesional:', error);
        this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al crear el profesional';
        this.successMessage = '';
      }
    });
  }

  updateProfesional(): void {
    if (this.profesional.id) {
      // Normalizar datos antes de enviar
      const profesionalToSave = {
        ...this.profesional,
        nombreUsuario: this.profesional.nombreUsuario.toUpperCase().trim(),
        password: this.profesional.password?.toLowerCase().trim() || undefined // Solo enviar si tiene valor
      };
      
      this.profesionalService.update(this.profesional.id, profesionalToSave).subscribe({
        next: () => {
          this.successMessage = 'Profesional actualizado exitosamente';
          this.errorMessage = '';
          this.loadProfesionales();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar profesional:', error);
          this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al actualizar el profesional';
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

  toggleActivo(profesional: Profesional): void {
    const profesionalActualizado = {
      ...profesional,
      activo: !profesional.activo
    };
    
    if (profesional.id) {
      this.profesionalService.update(profesional.id, profesionalActualizado).subscribe({
        next: () => {
          this.successMessage = `Profesional ${profesionalActualizado.activo ? 'activado' : 'desactivado'} exitosamente`;
          this.errorMessage = '';
          this.loadProfesionales();
        },
        error: (error) => {
          console.error('Error al cambiar estado del profesional:', error);
          this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al cambiar el estado del profesional';
          this.successMessage = '';
          this.loadProfesionales(); // Recargar para revertir el cambio visual
        }
      });
    }
  }

  onNombreUsuarioInput(event: any): void {
    const input = event.target;
    this.profesional.nombreUsuario = input.value.toUpperCase();
  }

  onPasswordInput(event: any): void {
    const input = event.target;
    this.profesional.password = input.value.toLowerCase();
  }

  trackByProfesionalId(index: number, profesional: Profesional): number | undefined {
    return profesional.id;
  }

}

