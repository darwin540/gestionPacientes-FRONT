import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';
import { ServicioResponse } from '../../../models/servicio.model';

@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicio-list.component.html',
  styleUrl: './servicio-list.component.css'
})
export class ServicioListComponent implements OnInit {
  private servicioService = inject(ServicioService);

  servicios: ServicioResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.servicioService.obtenerTodosLosServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los servicios';
        console.error(error);
      }
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          this.cargarServicios();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el servicio';
          console.error(error);
        }
      });
    }
  }
}


