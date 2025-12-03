import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ServicioDepartamentoService, ServicioDepartamento } from '../../services/servicio-departamento.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-servicios-departamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './servicios-departamentos.component.html',
  styleUrl: './servicios-departamentos.component.css'
})
export class ServiciosDepartamentosComponent implements OnInit {
  serviciosDepartamentos: ServicioDepartamento[] = [];
  servicioDepartamento: ServicioDepartamento = {
    abreviacion: '',
    nombre: '',
    activo: true
  };
  isEditing = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private servicioDepartamentoService: ServicioDepartamentoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Componente ServiciosDepartamentos inicializado');
    console.log('Estado inicial de serviciosDepartamentos:', this.serviciosDepartamentos);
    this.loadServiciosDepartamentos();
  }

  loadServiciosDepartamentos(): void {
    console.log('loadServiciosDepartamentos llamado');
    this.servicioDepartamentoService.getAll().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio:', data);
        console.log('Tipo de datos:', typeof data, Array.isArray(data));
        const nuevosDatos = Array.isArray(data) ? [...data] : [];
        this.serviciosDepartamentos = nuevosDatos;
        this.errorMessage = '';
        console.log('Servicios/Departamentos asignados:', this.serviciosDepartamentos);
        console.log('Longitud del array:', this.serviciosDepartamentos.length);
        // Forzar detección de cambios
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar servicios/departamentos:', error);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para ver los servicios/departamentos. Por favor, inicie sesión nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
        } else {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al cargar los servicios/departamentos';
        }
        this.successMessage = '';
        this.serviciosDepartamentos = [];
        this.cdr.markForCheck();
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.servicioDepartamento = {
      abreviacion: '',
      nombre: '',
      activo: true
    };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  openEditForm(servicio: ServicioDepartamento): void {
    this.isEditing = true;
    this.servicioDepartamento = { ...servicio };
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

    if (this.isEditing && this.servicioDepartamento.id) {
      this.updateServicioDepartamento();
    } else {
      this.createServicioDepartamento();
    }
  }

  createServicioDepartamento(): void {
    this.servicioDepartamentoService.create(this.servicioDepartamento).subscribe({
      next: () => {
        this.successMessage = 'Servicio/Departamento creado exitosamente';
        this.errorMessage = '';
        this.loadServiciosDepartamentos();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error al crear servicio/departamento:', error);
        this.errorMessage = error.error?.mensaje || 'Error al crear el servicio/departamento';
        this.successMessage = '';
      }
    });
  }

  updateServicioDepartamento(): void {
    if (this.servicioDepartamento.id) {
      this.servicioDepartamentoService.update(this.servicioDepartamento.id, this.servicioDepartamento).subscribe({
        next: () => {
          this.successMessage = 'Servicio/Departamento actualizado exitosamente';
          this.errorMessage = '';
          this.loadServiciosDepartamentos();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar servicio/departamento:', error);
          this.errorMessage = error.error?.mensaje || 'Error al actualizar el servicio/departamento';
          this.successMessage = '';
        }
      });
    }
  }

  deleteServicioDepartamento(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este servicio/departamento?')) {
      this.servicioDepartamentoService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Servicio/Departamento eliminado exitosamente';
          this.errorMessage = '';
          this.loadServiciosDepartamentos();
        },
        error: (error) => {
          console.error('Error al eliminar servicio/departamento:', error);
          this.errorMessage = error.error?.mensaje || 'Error al eliminar el servicio/departamento';
          this.successMessage = '';
        }
      });
    }
  }

  toggleActivo(servicio: ServicioDepartamento): void {
    const nuevoEstado = !servicio.activo;
    servicio.activo = nuevoEstado;
    if (servicio.id) {
      this.servicioDepartamentoService.update(servicio.id, servicio).subscribe({
        next: () => {
          this.successMessage = nuevoEstado ? 'Servicio/Departamento activado' : 'Servicio/Departamento desactivado';
          this.errorMessage = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.errorMessage = error.error?.mensaje || 'Error al actualizar el estado';
          servicio.activo = !nuevoEstado;
          this.successMessage = '';
        }
      });
    }
  }

  trackByServicioId(index: number, servicio: ServicioDepartamento): any {
    return servicio.id || index;
  }
}

