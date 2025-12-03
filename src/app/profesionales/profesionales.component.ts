import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profesional } from '../models/profesional.model';
import { ProfesionalService } from '../services/profesional.service';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TipoTerapiaService, TipoTerapia } from '../services/tipo-terapia.service';

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
  
  tiposTerapia: TipoTerapia[] = [];
  isEditing = false;
  showForm = false;
  showPasswordModal = false;
  selectedProfesionalForPassword: Profesional | null = null;
  newPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private profesionalService: ProfesionalService,
    private authService: AuthService,
    private tipoTerapiaService: TipoTerapiaService,
    private cdr: ChangeDetectorRef
  ) { }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProfesionales();
    this.loadTiposTerapia(); // Cargar tipos de terapia (cuando esté disponible)
  }

  loadTiposTerapia(): void {
    this.tipoTerapiaService.getActivos().subscribe({
      next: (data) => {
        this.tiposTerapia = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar tipos de terapia:', error);
        this.tiposTerapia = [];
        this.cdr.markForCheck();
      }
    });
  }

  loadProfesionales(): void {
    this.profesionalService.getAll().subscribe({
      next: (data) => {
        const nuevosDatos = Array.isArray(data) ? [...data] : [];
        this.profesionales = nuevosDatos;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar profesionales:', error);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para ver los profesionales. Por favor, inicie sesión nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
        } else {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al cargar los profesionales';
        }
        this.successMessage = '';
        this.profesionales = [];
        this.cdr.detectChanges();
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
    document.body.classList.add('modal-open');
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
    document.body.classList.add('modal-open');
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.remove('modal-open');
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
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al crear profesional:', error);
        const errorMsg = error.error?.mensaje || error.error?.error || error.message || 'Error al crear el profesional';
        this.errorMessage = errorMsg;
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
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
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

  openPasswordModal(profesional: Profesional): void {
    this.selectedProfesionalForPassword = profesional;
    this.newPassword = '';
    this.showPasswordModal = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.add('modal-open');
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.selectedProfesionalForPassword = null;
    this.newPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.remove('modal-open');
  }

  updatePassword(): void {
    if (!this.selectedProfesionalForPassword || !this.selectedProfesionalForPassword.id) {
      return;
    }

    if (!this.newPassword || this.newPassword.trim().length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    const passwordToUpdate = this.newPassword.toLowerCase().trim();
    
    this.profesionalService.updatePassword(this.selectedProfesionalForPassword.id, passwordToUpdate).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada exitosamente';
        this.errorMessage = '';
        this.closePasswordModal();
      },
      error: (error) => {
        console.error('Error al actualizar contraseña:', error);
        this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al actualizar la contraseña';
        this.successMessage = '';
      }
    });
  }
}

