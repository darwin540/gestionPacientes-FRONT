import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { PacienteResponse } from '../../../models/paciente.model';
import { TipoDocumento } from '../../../models/tipo-documento.enum';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.css'
})
export class PacienteListComponent implements OnInit {
  private pacienteService = inject(PacienteService);

  pacientes: PacienteResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pacienteService.obtenerTodosLosPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los pacientes';
        console.error(error);
      }
    });
  }

  eliminarPaciente(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.pacienteService.eliminarPaciente(id).subscribe({
        next: () => {
          this.cargarPacientes();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el paciente';
          console.error(error);
        }
      });
    }
  }

  getTipoDocumentoLabel(tipo: TipoDocumento): string {
    return tipo === TipoDocumento.CC ? 'Cédula' : 'Tarjeta de Identidad';
  }
}



