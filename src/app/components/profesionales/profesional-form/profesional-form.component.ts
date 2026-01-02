import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfesionalService } from '../../../services/profesional.service';
import { TipoTerapiaService } from '../../../services/tipo-terapia.service';
import { ProfesionalRequest, ProfesionalUpdate } from '../../../models/profesional.model';
import { TipoTerapiaResponse } from '../../../models/tipo-terapia.model';

@Component({
  selector: 'app-profesional-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesional-form.component.html',
  styleUrl: './profesional-form.component.css'
})
export class ProfesionalFormComponent implements OnInit {
  private profesionalService = inject(ProfesionalService);
  private tipoTerapiaService = inject(TipoTerapiaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  profesional: ProfesionalRequest = {
    nombre: '',
    profesion: '',
    numeroCuentaBanco: '',
    nombreBanco: '',
    email: '',
    username: '',
    password: '',
    tiposTerapiaIds: []
  };

  tiposTerapia: TipoTerapiaResponse[] = [];
  tiposTerapiaSeleccionados: number[] = [];
  isEditMode: boolean = false;
  profesionalId: number | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.cargarTiposTerapia();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.profesionalId = parseInt(id, 10);
      this.cargarProfesional(this.profesionalId);
    }
  }

  cargarTiposTerapia(): void {
    this.tipoTerapiaService.obtenerTodosLosTiposTerapia().subscribe({
      next: (data) => {
        this.tiposTerapia = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de terapia', error);
      }
    });
  }

  cargarProfesional(id: number): void {
    this.isLoading = true;
    this.profesionalService.obtenerProfesionalPorId(id).subscribe({
      next: (data) => {
        this.profesional = {
          nombre: data.nombre,
          profesion: data.profesion,
          numeroCuentaBanco: data.numeroCuentaBanco,
          nombreBanco: data.nombreBanco,
          email: '',
          username: '',
          password: '',
          tiposTerapiaIds: []
        };
        this.tiposTerapiaSeleccionados = data.tiposTerapia.map(t => t.id);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el profesional';
        console.error(error);
      }
    });
  }

  toggleTipoTerapia(id: number): void {
    const index = this.tiposTerapiaSeleccionados.indexOf(id);
    if (index > -1) {
      this.tiposTerapiaSeleccionados.splice(index, 1);
    } else {
      this.tiposTerapiaSeleccionados.push(id);
    }
  }

  isTipoTerapiaSeleccionado(id: number): boolean {
    return this.tiposTerapiaSeleccionados.includes(id);
  }

  onSubmit(): void {
    if (!this.profesional.nombre || !this.profesional.profesion || 
        !this.profesional.numeroCuentaBanco || !this.profesional.nombreBanco ||
        !this.profesional.email) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios';
      return;
    }

    if (!this.isEditMode && (!this.profesional.username || !this.profesional.password)) {
      this.errorMessage = 'El nombre de usuario y contraseña son obligatorios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.profesional.tiposTerapiaIds = this.tiposTerapiaSeleccionados;

    if (this.isEditMode && this.profesionalId) {
      const updateData: ProfesionalUpdate = {
        nombre: this.profesional.nombre,
        profesion: this.profesional.profesion,
        numeroCuentaBanco: this.profesional.numeroCuentaBanco,
        nombreBanco: this.profesional.nombreBanco,
        email: this.profesional.email
      };
      this.profesionalService.actualizarProfesional(this.profesionalId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/profesionales']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el profesional';
        }
      });
    } else {
      this.profesionalService.crearProfesional(this.profesional).subscribe({
        next: () => {
          this.router.navigate(['/profesionales']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear el profesional';
        }
      });
    }
  }
}



