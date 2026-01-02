import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfesionalService } from '../../../services/profesional.service';
import { ProfesionalResponse } from '../../../models/profesional.model';

@Component({
  selector: 'app-profesional-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesional-list.component.html',
  styleUrl: './profesional-list.component.css'
})
export class ProfesionalListComponent implements OnInit {
  private profesionalService = inject(ProfesionalService);

  profesionales: ProfesionalResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profesionalService.obtenerTodosLosProfesionales().subscribe({
      next: (data) => {
        this.profesionales = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los profesionales';
        console.error(error);
      }
    });
  }

  eliminarProfesional(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este profesional?')) {
      this.profesionalService.eliminarProfesional(id).subscribe({
        next: () => {
          this.cargarProfesionales();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el profesional';
          console.error(error);
        }
      });
    }
  }
}


