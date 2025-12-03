import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TipoTerapiaService, TipoTerapia } from '../../services/tipo-terapia.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-tipos-terapia',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './tipos-terapia.component.html',
  styleUrl: './tipos-terapia.component.css'
})
export class TiposTerapiaComponent implements OnInit {
  tiposTerapia: TipoTerapia[] = [];
  tipoTerapia: TipoTerapia = {
    nombre: '',
    valorUnitario: 0,
    activo: true
  };
  isEditing = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tipoTerapiaService: TipoTerapiaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTiposTerapia();
  }

  loadTiposTerapia(): void {
    this.tipoTerapiaService.getAll().subscribe({
      next: (data) => {
        const nuevosDatos = Array.isArray(data) ? [...data] : [];
        this.tiposTerapia = nuevosDatos;
        this.errorMessage = '';
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar tipos de terapia:', error);
        this.errorMessage = error.error?.mensaje || 'Error al cargar los tipos de terapia';
        this.successMessage = '';
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.tipoTerapia = {
      nombre: '',
      valorUnitario: 0,
      activo: true
    };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.add('modal-open'); // Prevenir scroll del body
  }

  openEditForm(tipo: TipoTerapia): void {
    this.isEditing = true;
    this.tipoTerapia = { ...tipo };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.add('modal-open'); // Prevenir scroll del body
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.classList.remove('modal-open'); // Habilitar scroll del body
  }

  save(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    // Normalizar nombre a mayúsculas
    const tipoTerapiaToSave = {
      ...this.tipoTerapia,
      nombre: this.tipoTerapia.nombre.toUpperCase().trim()
    };

    if (this.isEditing && this.tipoTerapia.id) {
      this.updateTipoTerapia(tipoTerapiaToSave);
    } else {
      this.createTipoTerapia(tipoTerapiaToSave);
    }
  }

  createTipoTerapia(tipo: TipoTerapia): void {
    this.tipoTerapiaService.create(tipo).subscribe({
      next: () => {
        this.successMessage = 'Tipo de terapia creado exitosamente';
        this.errorMessage = '';
        this.loadTiposTerapia();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error al crear tipo de terapia:', error);
        this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al crear el tipo de terapia';
        this.successMessage = '';
      }
    });
  }

  updateTipoTerapia(tipo: TipoTerapia): void {
    if (tipo.id) {
      this.tipoTerapiaService.update(tipo.id, tipo).subscribe({
        next: () => {
          this.successMessage = 'Tipo de terapia actualizado exitosamente';
          this.errorMessage = '';
          this.loadTiposTerapia();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar tipo de terapia:', error);
          this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al actualizar el tipo de terapia';
          this.successMessage = '';
        }
      });
    }
  }

  toggleActivo(tipo: TipoTerapia): void {
    const tipoActualizado = {
      ...tipo,
      activo: !tipo.activo
    };
    
    if (tipo.id) {
      this.tipoTerapiaService.update(tipo.id, tipoActualizado).subscribe({
        next: () => {
          this.successMessage = `Tipo de terapia ${tipoActualizado.activo ? 'activado' : 'desactivado'} exitosamente`;
          this.errorMessage = '';
          this.loadTiposTerapia();
        },
        error: (error) => {
          console.error('Error al cambiar estado del tipo de terapia:', error);
          this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al cambiar el estado';
          this.successMessage = '';
          this.loadTiposTerapia();
        }
      });
    }
  }

  deleteTipoTerapia(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de terapia?')) {
      this.tipoTerapiaService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Tipo de terapia eliminado exitosamente';
          this.errorMessage = '';
          this.loadTiposTerapia();
        },
        error: (error) => {
          console.error('Error al eliminar tipo de terapia:', error);
          this.errorMessage = error.error?.mensaje || error.error?.error || 'Error al eliminar el tipo de terapia';
          this.successMessage = '';
        }
      });
    }
  }

  trackByTipoId(index: number, tipo: TipoTerapia): number | undefined {
    return tipo.id;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  }
}

