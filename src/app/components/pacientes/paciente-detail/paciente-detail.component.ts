import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PacienteService } from '../../../services/paciente.service';
import { ServicioService } from '../../../services/servicio.service';
import { RegistroTerapiaService } from '../../../services/registro-terapia.service';
import { PacienteResponse, PacienteUpdate } from '../../../models/paciente.model';
import { TipoDocumento } from '../../../models/tipo-documento.enum';
import { ServicioResponse } from '../../../models/servicio.model';
import { RegistroTerapiaRequest, RegistroTerapiaItem } from '../../../models/registro-terapia.model';

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './paciente-detail.component.html',
  styleUrl: './paciente-detail.component.css'
})
export class PacienteDetailComponent implements OnInit, OnDestroy {
  private pacienteService = inject(PacienteService);
  private servicioService = inject(ServicioService);
  private registroTerapiaService = inject(RegistroTerapiaService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  public router = inject(Router);

  private subscriptions = new Subscription();

  paciente: PacienteResponse | null = null;
  isLoading: boolean = true; // Iniciar como true para mostrar loading inicial
  errorMessage: string = '';

  // Exponer TipoDocumento para usar en el template
  TipoDocumento = TipoDocumento;

  // Modal de edición
  showEditModal: boolean = false;
  editForm: PacienteUpdate = {};
  editErrorMessage: string = '';
  isSavingEdit: boolean = false;

  // Modal de asignación de tipo de terapia
  showAsignarModal: boolean = false;
  servicios: ServicioResponse[] = [];
  diasSeleccionados: Map<string, { servicioAbreviatura: string; numeroSesiones: number }> = new Map();
  mesActual: Date = new Date();
  asignarErrorMessage: string = '';
  isSavingAsignar: boolean = false;

  ngOnInit(): void {
    const paramSub = this.route.paramMap.subscribe(params => {
      const pacienteId = params.get('id');
      if (pacienteId) {
        const id = parseInt(pacienteId, 10);
        if (!isNaN(id)) {
          this.cargarPaciente(id);
        } else {
          this.errorMessage = 'ID de paciente inválido';
          this.isLoading = false;
        }
      } else {
        this.errorMessage = 'No se proporcionó un ID de paciente';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(paramSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarPaciente(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.paciente = null;
    this.cdr.detectChanges(); // Forzar detección de cambios para mostrar loading
    
    console.log('Cargando paciente con ID:', id);
    
    const loadSub = this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (data) => {
        console.log('Paciente cargado:', data);
        this.paciente = data;
        this.isLoading = false;
        this.errorMessage = '';
        // Forzar detección de cambios después de cargar los datos
        this.cdr.detectChanges();
        console.log('Estado después de cargar - isLoading:', this.isLoading, 'paciente:', this.paciente);
      },
      error: (error) => {
        console.error('Error completo al cargar paciente:', error);
        this.isLoading = false;
        this.paciente = null;
        this.errorMessage = error.error?.message || error.message || 'Error al cargar el paciente. Por favor, intente nuevamente.';
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.add(loadSub);
  }

  getTipoDocumentoLabel(tipo: TipoDocumento): string {
    return tipo === TipoDocumento.CC ? 'Cédula' : 'Tarjeta de Identidad';
  }

  // Métodos para el modal de edición
  abrirModalEditar(): void {
    if (this.paciente) {
      this.editForm = {
        nombre: this.paciente.nombre,
        apellido: this.paciente.apellido,
        tipoDocumento: this.paciente.tipoDocumento,
        documento: this.paciente.documento
      };
      this.editErrorMessage = '';
      this.showEditModal = true;
    }
  }

  cerrarModalEditar(): void {
    this.showEditModal = false;
    this.editForm = {};
    this.editErrorMessage = '';
  }

  guardarEdicion(): void {
    if (!this.paciente || !this.paciente.id) {
      this.editErrorMessage = 'No se puede editar el paciente';
      return;
    }

    if (!this.editForm.nombre || !this.editForm.apellido || !this.editForm.documento) {
      this.editErrorMessage = 'Por favor, complete todos los campos obligatorios';
      return;
    }

    this.isSavingEdit = true;
    this.editErrorMessage = '';

    this.pacienteService.actualizarPaciente(this.paciente.id, this.editForm).subscribe({
      next: (data) => {
        this.paciente = data;
        this.isSavingEdit = false;
        this.cerrarModalEditar();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSavingEdit = false;
        this.editErrorMessage = error.error?.message || 'Error al actualizar el paciente';
        console.error('Error al actualizar paciente:', error);
      }
    });
  }

  // Métodos para el modal de asignación
  abrirModalAsignar(): void {
    this.diasSeleccionados = new Map();
    this.mesActual = new Date();
    this.asignarErrorMessage = '';
    this.showAsignarModal = true;
    this.cargarServicios();
  }

  cerrarModalAsignar(): void {
    this.showAsignarModal = false;
    this.diasSeleccionados = new Map();
    this.mesActual = new Date();
    this.asignarErrorMessage = '';
  }

  // Métodos del calendario
  seleccionarDia(fecha: string): void {
    if (!this.diasSeleccionados.has(fecha)) {
      this.diasSeleccionados.set(fecha, {
        servicioAbreviatura: '',
        numeroSesiones: 1
      });
    }
  }

  deseleccionarDia(fecha: string): void {
    this.diasSeleccionados.delete(fecha);
    if (this.diaSeleccionadoActual === fecha) {
      this.diaSeleccionadoActual = null;
    }
  }

  estaDiaSeleccionado(fecha: string): boolean {
    return this.diasSeleccionados.has(fecha);
  }

  actualizarServicioDia(fecha: string, servicioAbreviatura: string): void {
    if (!this.diasSeleccionados.has(fecha)) {
      this.diasSeleccionados.set(fecha, {
        servicioAbreviatura: '',
        numeroSesiones: 1
      });
    }
    const datosActuales = this.diasSeleccionados.get(fecha) || { servicioAbreviatura: '', numeroSesiones: 1 };
    this.diasSeleccionados.set(fecha, {
      servicioAbreviatura: servicioAbreviatura,
      numeroSesiones: datosActuales.numeroSesiones
    });
  }

  actualizarSesionesDia(fecha: string, numeroSesiones: number): void {
    if (!this.diasSeleccionados.has(fecha)) {
      this.diasSeleccionados.set(fecha, {
        servicioAbreviatura: '',
        numeroSesiones: 1
      });
    }
    const datosActuales = this.diasSeleccionados.get(fecha) || { servicioAbreviatura: '', numeroSesiones: 1 };
    this.diasSeleccionados.set(fecha, {
      servicioAbreviatura: datosActuales.servicioAbreviatura,
      numeroSesiones: numeroSesiones
    });
  }

  obtenerDatosDia(fecha: string): { servicioAbreviatura: string; numeroSesiones: number } | null {
    return this.diasSeleccionados.get(fecha) || null;
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
  }

  obtenerDiasDelMes(): Date[] {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    
    // Agregar días del mes anterior para completar la primera semana
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Agregar todos los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  esDiaDelMesActual(fecha: Date): boolean {
    return fecha.getMonth() === this.mesActual.getMonth() && 
           fecha.getFullYear() === this.mesActual.getFullYear();
  }

  obtenerNombreMes(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[this.mesActual.getMonth()];
  }

  obtenerNombreDiaSemana(index: number): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[index];
  }

  formatearFechaParaMostrar(fechaString: string): string {
    const fecha = new Date(fechaString + 'T00:00:00');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  cargarServicios(): void {
    this.servicioService.obtenerTodosLosServicios().subscribe({
      next: (data) => {
        this.servicios = data;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.asignarErrorMessage = 'Error al cargar los servicios';
      }
    });
  }

  guardarAsignacion(): void {
    if (!this.paciente || !this.paciente.id) {
      this.asignarErrorMessage = 'No se puede asignar terapia al paciente';
      return;
    }

    if (this.diasSeleccionados.size === 0) {
      this.asignarErrorMessage = 'Por favor, seleccione al menos un día';
      return;
    }

    // Validar que todos los días seleccionados tengan los campos completos
    const registrosInvalidos: string[] = [];
    this.diasSeleccionados.forEach((datos, fecha) => {
      if (!datos.servicioAbreviatura || !datos.numeroSesiones) {
        registrosInvalidos.push(fecha);
      }
    });

    if (registrosInvalidos.length > 0) {
      this.asignarErrorMessage = 'Por favor, complete el servicio y número de sesiones para todos los días seleccionados';
      return;
    }

    this.isSavingAsignar = true;
    this.asignarErrorMessage = '';

    // Convertir el Map a array de RegistroTerapiaItem
    const registros: RegistroTerapiaItem[] = [];
    this.diasSeleccionados.forEach((datos, fecha) => {
      registros.push({
        fecha: fecha,
        servicioAbreviatura: datos.servicioAbreviatura,
        numeroSesiones: datos.numeroSesiones
      });
    });

    const registroRequest: RegistroTerapiaRequest = {
      pacienteId: this.paciente.id,
      registros: registros
    };

    this.registroTerapiaService.crearRegistros(registroRequest).subscribe({
      next: () => {
        this.isSavingAsignar = false;
        this.cerrarModalAsignar();
        // Recargar el paciente para mostrar los cambios
        if (this.paciente) {
          this.cargarPaciente(this.paciente.id);
        }
      },
      error: (error) => {
        this.isSavingAsignar = false;
        this.asignarErrorMessage = error.error?.message || 'Error al asignar la terapia';
        console.error('Error al asignar terapia:', error);
      }
    });
  }
}
