import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoTerapiaService } from '../../../services/tipo-terapia.service';
import { TipoTerapiaRequest, TipoTerapiaUpdate } from '../../../models/tipo-terapia.model';

@Component({
  selector: 'app-tipo-terapia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-terapia-form.component.html',
  styleUrl: './tipo-terapia-form.component.css'
})
export class TipoTerapiaFormComponent implements OnInit {
  private tipoTerapiaService = inject(TipoTerapiaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tipoTerapia: TipoTerapiaRequest = {
    nombre: '',
    valorUnitario: 0
  };

  isEditMode: boolean = false;
  tipoTerapiaId: number | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tipoTerapiaId = parseInt(id, 10);
      this.cargarTipoTerapia(this.tipoTerapiaId);
    }
  }

  cargarTipoTerapia(id: number): void {
    this.isLoading = true;
    this.tipoTerapiaService.obtenerTipoTerapiaPorId(id).subscribe({
      next: (data) => {
        this.tipoTerapia = {
          nombre: data.nombre,
          valorUnitario: data.valorUnitario
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el tipo de terapia';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (!this.tipoTerapia.nombre || !this.tipoTerapia.valorUnitario || this.tipoTerapia.valorUnitario <= 0) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios con valores válidos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.tipoTerapiaId) {
      const updateData: TipoTerapiaUpdate = { ...this.tipoTerapia };
      this.tipoTerapiaService.actualizarTipoTerapia(this.tipoTerapiaId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/tipos-terapia']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el tipo de terapia';
        }
      });
    } else {
      this.tipoTerapiaService.crearTipoTerapia(this.tipoTerapia).subscribe({
        next: () => {
          this.router.navigate(['/tipos-terapia']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear el tipo de terapia';
        }
      });
    }
  }
}



