import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoTerapiaService } from '../../../services/tipo-terapia.service';
import { TipoTerapiaResponse } from '../../../models/tipo-terapia.model';

@Component({
  selector: 'app-tipo-terapia-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-terapia-list.component.html',
  styleUrl: './tipo-terapia-list.component.css'
})
export class TipoTerapiaListComponent implements OnInit {
  private tipoTerapiaService = inject(TipoTerapiaService);

  tiposTerapia: TipoTerapiaResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarTiposTerapia();
  }

  cargarTiposTerapia(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tipoTerapiaService.obtenerTodosLosTiposTerapia().subscribe({
      next: (data) => {
        this.tiposTerapia = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los tipos de terapia';
        console.error(error);
      }
    });
  }

  eliminarTipoTerapia(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo de terapia?')) {
      this.tipoTerapiaService.eliminarTipoTerapia(id).subscribe({
        next: () => {
          this.cargarTiposTerapia();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el tipo de terapia';
          console.error(error);
        }
      });
    }
  }
}


