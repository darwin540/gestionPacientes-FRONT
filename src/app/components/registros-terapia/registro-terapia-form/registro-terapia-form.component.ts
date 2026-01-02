import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistroTerapiaService } from '../../../services/registro-terapia.service';
import { PacienteService } from '../../../services/paciente.service';
import { ServicioService } from '../../../services/servicio.service';
import { RegistroTerapiaRequest, RegistroTerapiaItem, RegistroTerapiaUpdate } from '../../../models/registro-terapia.model';
import { PacienteResponse } from '../../../models/paciente.model';
import { ServicioResponse } from '../../../models/servicio.model';

@Component({
  selector: 'app-registro-terapia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-terapia-form.component.html',
  styleUrl: './registro-terapia-form.component.css'
})
export class RegistroTerapiaFormComponent implements OnInit {
  private registroTerapiaService = inject(RegistroTerapiaService);
  private pacienteService = inject(PacienteService);
  private servicioService = inject(ServicioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  registro: RegistroTerapiaRequest = {
    pacienteId: 0,
    registros: []
  };

  pacientes: PacienteResponse[] = [];
  servicios: ServicioResponse[] = [];
  registrosItems: RegistroTerapiaItem[] = [{
    fecha: '',
    servicioAbreviatura: '',
    numeroSesiones: 1
  }];

  isEditMode: boolean = false;
  registroId: number | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarServicios();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.registroId = parseInt(id, 10);
      this.cargarRegistro(this.registroId);
    }
  }

  cargarPacientes(): void {
    this.pacienteService.obtenerTodosLosPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (error) => {
        console.error('Error al cargar pacientes', error);
      }
    });
  }

  cargarServicios(): void {
    this.servicioService.obtenerTodosLosServicios().subscribe({
      next: (data) => {
        this.servicios = data;
      },
      error: (error) => {
        console.error('Error al cargar servicios', error);
      }
    });
  }

  cargarRegistro(id: number): void {
    this.isLoading = true;
    this.registroTerapiaService.obtenerRegistroPorId(id).subscribe({
      next: (data) => {
        this.registro.pacienteId = data.pacienteId;
        this.registrosItems = [{
          fecha: data.fecha,
          servicioAbreviatura: data.servicioAbreviatura,
          numeroSesiones: data.numeroSesiones
        }];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el registro';
        console.error(error);
      }
    });
  }

  agregarRegistro(): void {
    this.registrosItems.push({
      fecha: '',
      servicioAbreviatura: '',
      numeroSesiones: 1
    });
  }

  eliminarRegistro(index: number): void {
    this.registrosItems.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.registro.pacienteId || this.registrosItems.length === 0) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.registro.registros = this.registrosItems;

    if (this.isEditMode && this.registroId) {
      const updateData: RegistroTerapiaUpdate = {
        fecha: this.registrosItems[0].fecha,
        servicioAbreviatura: this.registrosItems[0].servicioAbreviatura,
        numeroSesiones: this.registrosItems[0].numeroSesiones
      };
      this.registroTerapiaService.actualizarRegistro(this.registroId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/registros-terapia']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el registro';
        }
      });
    } else {
      this.registroTerapiaService.crearRegistros(this.registro).subscribe({
        next: () => {
          this.router.navigate(['/registros-terapia']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear el registro';
        }
      });
    }
  }
}



