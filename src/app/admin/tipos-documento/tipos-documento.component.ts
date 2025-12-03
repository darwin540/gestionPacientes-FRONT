import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TipoDocumentoService, TipoDocumento } from '../../services/tipo-documento.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-tipos-documento',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './tipos-documento.component.html',
  styleUrl: './tipos-documento.component.css'
})
export class TiposDocumentoComponent implements OnInit {
  tiposDocumento: TipoDocumento[] = [];
  tipoDocumento: TipoDocumento = {
    nombre: '',
    descripcion: '',
    activo: true
  };
  isEditing = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTiposDocumento();
  }

  loadTiposDocumento(): void {
    this.tipoDocumentoService.getAll().subscribe({
      next: (data) => {
        const nuevosDatos = Array.isArray(data) ? [...data] : [];
        this.tiposDocumento = nuevosDatos;
        this.errorMessage = '';
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar tipos de documento:', error);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para ver los tipos de documento. Por favor, inicie sesión nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
        } else {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al cargar los tipos de documento';
        }
        this.successMessage = '';
        this.tiposDocumento = [];
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.tipoDocumento = {
      nombre: '',
      descripcion: '',
      activo: true
    };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  openEditForm(tipo: TipoDocumento): void {
    this.isEditing = true;
    this.tipoDocumento = { ...tipo };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.style.overflow = ''; // Restaurar scroll del body
  }

  save(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    if (this.isEditing && this.tipoDocumento.id) {
      this.updateTipoDocumento();
    } else {
      this.createTipoDocumento();
    }
  }

  createTipoDocumento(): void {
    this.tipoDocumentoService.create(this.tipoDocumento).subscribe({
      next: () => {
        this.successMessage = 'Tipo de documento creado exitosamente';
        this.errorMessage = '';
        this.loadTiposDocumento();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error al crear tipo de documento:', error);
        this.errorMessage = error.error?.mensaje || 'Error al crear el tipo de documento';
        this.successMessage = '';
      }
    });
  }

  updateTipoDocumento(): void {
    if (this.tipoDocumento.id) {
      this.tipoDocumentoService.update(this.tipoDocumento.id, this.tipoDocumento).subscribe({
        next: () => {
          this.successMessage = 'Tipo de documento actualizado exitosamente';
          this.errorMessage = '';
          this.loadTiposDocumento();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar tipo de documento:', error);
          this.errorMessage = error.error?.mensaje || 'Error al actualizar el tipo de documento';
          this.successMessage = '';
        }
      });
    }
  }

  deleteTipoDocumento(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de documento?')) {
      this.tipoDocumentoService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Tipo de documento eliminado exitosamente';
          this.errorMessage = '';
          this.loadTiposDocumento();
        },
        error: (error) => {
          console.error('Error al eliminar tipo de documento:', error);
          this.errorMessage = error.error?.mensaje || 'Error al eliminar el tipo de documento';
          this.successMessage = '';
        }
      });
    }
  }

  toggleActivo(tipo: TipoDocumento): void {
    const nuevoEstado = !tipo.activo;
    tipo.activo = nuevoEstado;
    if (tipo.id) {
      this.tipoDocumentoService.update(tipo.id, tipo).subscribe({
        next: () => {
          this.successMessage = nuevoEstado ? 'Tipo de documento activado' : 'Tipo de documento desactivado';
          this.errorMessage = '';
          // Limpiar mensaje después de 2 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.errorMessage = error.error?.mensaje || 'Error al actualizar el estado';
          tipo.activo = !nuevoEstado; // Revertir cambio
          this.successMessage = '';
        }
      });
    }
  }

  trackByTipoId(index: number, tipo: TipoDocumento): any {
    return tipo.id || index;
  }
}

