import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PacienteService } from '../../../services/paciente.service';
import { PacienteResponse } from '../../../models/paciente.model';
import { TipoDocumento } from '../../../models/tipo-documento.enum';

@Component({
  selector: 'app-paciente-profesional-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './paciente-profesional-view.component.html',
  styleUrl: './paciente-profesional-view.component.css'
})
export class PacienteProfesionalViewComponent implements OnInit, OnDestroy {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private subscriptions = new Subscription();

  pacientes: PacienteResponse[] = [];
  pacientesFiltrados: PacienteResponse[] = [];
  
  filtroTexto: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarPacientes();
    
    // Recargar cuando se vuelve a esta ruta desde otra
    const navSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        // Solo recargar si estamos en la ruta exacta de pacientes (no en detalle o nuevo)
        if (url === '/pacientes' || url === '/') {
          // Pequeño delay para asegurar que el componente esté listo
          setTimeout(() => {
            this.cargarPacientes();
          }, 100);
        }
      });
    this.subscriptions.add(navSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarPacientes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pacientes = [];
    this.pacientesFiltrados = [];
    console.log('Cargando lista de pacientes...');
    
    const loadSub = this.pacienteService.obtenerTodosLosPacientes().subscribe({
      next: (data) => {
        console.log('Pacientes cargados:', data);
        this.pacientes = data || [];
        this.pacientesFiltrados = data || [];
        this.isLoading = false;
        // Aplicar filtro si existe
        if (this.filtroTexto.trim()) {
          this.filtrarPacientes();
        }
        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || error.message || 'Error al cargar los pacientes';
        this.pacientes = [];
        this.pacientesFiltrados = [];
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.add(loadSub);
  }


  filtrarPacientes(): void {
    if (!this.filtroTexto.trim()) {
      this.pacientesFiltrados = this.pacientes;
      return;
    }

    const filtro = this.filtroTexto.toLowerCase().trim();
    this.pacientesFiltrados = this.pacientes.filter(paciente => 
      paciente.nombre.toLowerCase().includes(filtro) ||
      paciente.apellido.toLowerCase().includes(filtro) ||
      paciente.documento.toLowerCase().includes(filtro)
    );
  }

  getTipoDocumentoLabel(tipo: TipoDocumento): string {
    return tipo === TipoDocumento.CC ? 'Cédula' : 'Tarjeta de Identidad';
  }
}

