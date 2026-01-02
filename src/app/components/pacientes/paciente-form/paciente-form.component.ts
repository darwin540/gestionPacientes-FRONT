import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { PacienteRequest, PacienteUpdate } from '../../../models/paciente.model';
import { TipoDocumento } from '../../../models/tipo-documento.enum';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.css'
})
export class PacienteFormComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  paciente: PacienteRequest = {
    nombre: '',
    apellido: '',
    tipoDocumento: TipoDocumento.CC,
    documento: ''
  };

  tiposDocumento = Object.values(TipoDocumento);
  isEditMode: boolean = false;
  pacienteId: number | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pacienteId = parseInt(id, 10);
      this.cargarPaciente(this.pacienteId);
    }
  }

  cargarPaciente(id: number): void {
    this.isLoading = true;
    this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (data) => {
        this.paciente = {
          nombre: data.nombre,
          apellido: data.apellido,
          tipoDocumento: data.tipoDocumento,
          documento: data.documento
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el paciente';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (!this.paciente.nombre || !this.paciente.apellido || !this.paciente.documento) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.pacienteId) {
      const updateData: PacienteUpdate = { ...this.paciente };
      this.pacienteService.actualizarPaciente(this.pacienteId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/pacientes']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el paciente';
        }
      });
    } else {
      this.pacienteService.crearPaciente(this.paciente).subscribe({
        next: () => {
          this.router.navigate(['/pacientes']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear el paciente';
        }
      });
    }
  }

  getTipoDocumentoLabel(tipo: TipoDocumento): string {
    return tipo === TipoDocumento.CC ? 'Cédula de Ciudadanía' : 'Tarjeta de Identidad';
  }
}


