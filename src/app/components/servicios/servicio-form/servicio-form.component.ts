import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';
import { ServicioRequest, ServicioUpdate } from '../../../models/servicio.model';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servicio-form.component.html',
  styleUrl: './servicio-form.component.css'
})
export class ServicioFormComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  servicio: ServicioRequest = {
    nombreCompleto: '',
    abreviatura: ''
  };

  isEditMode: boolean = false;
  servicioId: number | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.servicioId = parseInt(id, 10);
      this.cargarServicio(this.servicioId);
    }
  }

  cargarServicio(id: number): void {
    this.isLoading = true;
    this.servicioService.obtenerServicioPorId(id).subscribe({
      next: (data) => {
        this.servicio = {
          nombreCompleto: data.nombreCompleto,
          abreviatura: data.abreviatura
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el servicio';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (!this.servicio.nombreCompleto || !this.servicio.abreviatura) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.servicioId) {
      const updateData: ServicioUpdate = { ...this.servicio };
      this.servicioService.actualizarServicio(this.servicioId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/servicios']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el servicio';
        }
      });
    } else {
      this.servicioService.crearServicio(this.servicio).subscribe({
        next: () => {
          this.router.navigate(['/servicios']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear el servicio';
        }
      });
    }
  }
}



