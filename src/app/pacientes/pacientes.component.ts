import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { PacienteService, Paciente } from '../services/paciente.service';
import { ProfesionalPacientes } from '../models/paciente.model';
import { AuthService } from '../services/auth.service';
import { TipoDocumentoService, TipoDocumento } from '../services/tipo-documento.service';
import { TerapiaService, Terapia } from '../services/terapia.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  // Vista de administrador
  profesionalesPacientes: ProfesionalPacientes[] = [];
  expandedProfesionales: Set<number> = new Set();

  // Vista de profesional
  searchType: 'documento' | 'nombre' = 'documento';
  searchDocumento: string = '';
  searchNombre: string = '';
  searchApellido: string = '';
  searchResults: Paciente[] = [];
  selectedPaciente: Paciente | null = null;
  pacienteForm: Paciente = {
    nombre: '',
    apellido: '',
    tipoDocumentoId: 0,
    numeroDocumento: ''
  };
  isEditing = false;
  showForm = false;
  pacienteSesiones: Terapia[] = [];
  showSesiones = false;

  tiposDocumento: TipoDocumento[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;
  searching = false;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private tipoDocumentoService: TipoDocumentoService,
    private terapiaService: TerapiaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.loadPacientesPorProfesional();
    } else {
      this.loadTiposDocumento();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Métodos para vista de administrador
  loadPacientesPorProfesional(): void {
    this.loading = true;
    this.errorMessage = '';
    this.pacienteService.getPacientesPorProfesional().subscribe({
      next: (data) => {
        const nuevosDatos = Array.isArray(data) ? [...data] : [];
        this.profesionalesPacientes = nuevosDatos;
        
        this.profesionalesPacientes.forEach(prof => {
          this.expandedProfesionales.add(prof.profesionalId);
        });
        
        this.errorMessage = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para ver los pacientes. Por favor, inicie sesión nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
        } else {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al cargar los pacientes';
        }
        this.profesionalesPacientes = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleProfesional(profesionalId: number): void {
    if (this.expandedProfesionales.has(profesionalId)) {
      this.expandedProfesionales.delete(profesionalId);
    } else {
      this.expandedProfesionales.add(profesionalId);
    }
    this.cdr.detectChanges();
  }

  isExpanded(profesionalId: number): boolean {
    return this.expandedProfesionales.has(profesionalId);
  }

  getNombreCompletoProfesional(prof: ProfesionalPacientes): string {
    return `${prof.profesionalNombre} ${prof.profesionalApellido}`;
  }

  getNombreCompletoPaciente(paciente: any): string {
    return `${paciente.nombre} ${paciente.apellido}`;
  }

  getTotalPacientes(): number {
    return this.profesionalesPacientes.reduce((total, prof) => total + prof.pacientes.length, 0);
  }

  // Métodos para vista de profesional
  loadTiposDocumento(): void {
    this.tipoDocumentoService.getActivos().subscribe({
      next: (data) => {
        this.tiposDocumento = data || [];
        if (this.tiposDocumento.length > 0 && !this.pacienteForm.tipoDocumentoId) {
          this.pacienteForm.tipoDocumentoId = this.tiposDocumento[0].id || 0;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los tipos de documento';
        this.cdr.detectChanges();
      }
    });
  }

  searchPaciente(): void {
    if (this.searchType === 'documento') {
      this.searchByDocumento();
    } else {
      this.searchByNombre();
    }
  }

  searchByDocumento(): void {
    if (!this.searchDocumento || this.searchDocumento.trim() === '') {
      this.errorMessage = 'Por favor, ingrese un número de documento';
      return;
    }

    this.searching = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.searchResults = [];

    this.pacienteService.searchByDocumento(this.searchDocumento.trim()).subscribe({
      next: (paciente) => {
        this.searchResults = [paciente];
        this.selectedPaciente = paciente;
        this.showSesiones = true;
        this.loadSesionesPaciente(paciente.id!);
        this.searching = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Paciente no encontrado. Puede crearlo con el formulario.';
          this.searchResults = [];
          this.selectedPaciente = null;
          this.showForm = true;
          this.resetForm();
          this.pacienteForm.numeroDocumento = this.searchDocumento.trim();
        } else {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al buscar el paciente';
        }
        this.searching = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchByNombre(): void {
    if ((!this.searchNombre || this.searchNombre.trim() === '') && 
        (!this.searchApellido || this.searchApellido.trim() === '')) {
      this.errorMessage = 'Por favor, ingrese nombre o apellido para buscar';
      return;
    }

    this.searching = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.searchResults = [];

    this.pacienteService.searchByNombreAndApellido(
      this.searchNombre?.trim() || undefined,
      this.searchApellido?.trim() || undefined
    ).subscribe({
      next: (pacientes) => {
        this.searchResults = pacientes;
        if (pacientes.length === 0) {
          this.errorMessage = 'No se encontraron pacientes. Puede crear uno nuevo con el formulario.';
          this.showForm = true;
          this.resetForm();
          this.pacienteForm.nombre = this.searchNombre?.trim() || '';
          this.pacienteForm.apellido = this.searchApellido?.trim() || '';
        } else if (pacientes.length === 1) {
          this.selectedPaciente = pacientes[0];
          this.showSesiones = true;
          this.loadSesionesPaciente(pacientes[0].id!);
        }
        this.searching = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al buscar pacientes';
        this.searching = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectPaciente(paciente: Paciente): void {
    this.selectedPaciente = paciente;
    this.showSesiones = true;
    this.loadSesionesPaciente(paciente.id!);
    this.showForm = false;
    this.cdr.detectChanges();
  }

  loadSesionesPaciente(pacienteId: number): void {
    this.terapiaService.getByPacienteId(pacienteId).subscribe({
      next: (sesiones) => {
        this.pacienteSesiones = sesiones.sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las sesiones del paciente';
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUniqueDates(sesiones: Terapia[]): Date[] {
    const dates = new Set<string>();
    sesiones.forEach(s => {
      const date = new Date(s.fecha);
      dates.add(date.toDateString());
    });
    return Array.from(dates).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
  }

  getSesionesByDate(date: Date): Terapia[] {
    const dateStr = date.toDateString();
    return this.pacienteSesiones.filter(s => {
      const sesionDate = new Date(s.fecha);
      return sesionDate.toDateString() === dateStr;
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.showForm = true;
    this.selectedPaciente = null;
    this.showSesiones = false;
    this.cdr.detectChanges();
  }

  openEditForm(paciente: Paciente): void {
    this.pacienteForm = {
      id: paciente.id,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      tipoDocumentoId: paciente.tipoDocumentoId,
      tipoDocumentoNombre: paciente.tipoDocumentoNombre,
      numeroDocumento: paciente.numeroDocumento
    };
    this.isEditing = true;
    this.showForm = true;
    this.selectedPaciente = null;
    this.showSesiones = false;
    this.cdr.detectChanges();
  }

  resetForm(): void {
    this.pacienteForm = {
      nombre: '',
      apellido: '',
      tipoDocumentoId: this.tiposDocumento.length > 0 ? (this.tiposDocumento[0].id || 0) : 0,
      numeroDocumento: ''
    };
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  savePaciente(): void {
    if (!this.pacienteForm.nombre || !this.pacienteForm.apellido || 
        !this.pacienteForm.numeroDocumento || !this.pacienteForm.tipoDocumentoId) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing && this.pacienteForm.id) {
      this.pacienteService.update(this.pacienteForm.id, this.pacienteForm).subscribe({
        next: (paciente) => {
          this.successMessage = 'Paciente actualizado correctamente';
          this.selectedPaciente = paciente;
          this.showForm = false;
          this.showSesiones = true;
          this.loadSesionesPaciente(paciente.id!);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al actualizar el paciente';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.pacienteService.create(this.pacienteForm).subscribe({
        next: (paciente) => {
          this.successMessage = 'Paciente creado correctamente';
          this.selectedPaciente = paciente;
          this.showForm = false;
          this.showSesiones = false;
          this.searchResults = [paciente];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error.error?.mensaje || error.error?.message || 'Error al crear el paciente';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
    this.cdr.detectChanges();
  }
}
