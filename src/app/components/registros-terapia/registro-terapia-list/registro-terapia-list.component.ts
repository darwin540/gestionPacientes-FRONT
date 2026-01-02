import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistroTerapiaService } from '../../../services/registro-terapia.service';
import { RegistroTerapiaResponse } from '../../../models/registro-terapia.model';

@Component({
  selector: 'app-registro-terapia-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registro-terapia-list.component.html',
  styleUrl: './registro-terapia-list.component.css'
})
export class RegistroTerapiaListComponent implements OnInit {
  private registroTerapiaService = inject(RegistroTerapiaService);

  registros: RegistroTerapiaResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Cargar todos los registros - en producción podría filtrarse por paciente
    this.registroTerapiaService.obtenerRegistroPorId(1).subscribe({
      next: (data) => {
        // Por ahora mostramos un mensaje, en producción se cargarían todos
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // En producción, aquí se cargarían todos los registros
        console.error(error);
      }
    });
  }

  eliminarRegistro(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      this.registroTerapiaService.eliminarRegistro(id).subscribe({
        next: () => {
          this.cargarRegistros();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el registro';
          console.error(error);
        }
      });
    }
  }
}


