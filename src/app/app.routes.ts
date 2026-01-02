import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'pacientes',
        loadComponent: () => import('./components/pacientes/paciente-profesional-view/paciente-profesional-view.component').then(m => m.PacienteProfesionalViewComponent)
      },
      {
        path: 'pacientes-admin',
        loadComponent: () => import('./components/pacientes/paciente-list/paciente-list.component').then(m => m.PacienteListComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'pacientes/nuevo',
        loadComponent: () => import('./components/pacientes/paciente-form/paciente-form.component').then(m => m.PacienteFormComponent)
      },
      {
        path: 'pacientes/:id',
        loadComponent: () => import('./components/pacientes/paciente-detail/paciente-detail.component').then(m => m.PacienteDetailComponent)
      },
      {
        path: 'pacientes/:id/editar',
        loadComponent: () => import('./components/pacientes/paciente-form/paciente-form.component').then(m => m.PacienteFormComponent)
      },
      {
        path: 'profesionales',
        loadComponent: () => import('./components/profesionales/profesional-list/profesional-list.component').then(m => m.ProfesionalListComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'profesionales/nuevo',
        loadComponent: () => import('./components/profesionales/profesional-form/profesional-form.component').then(m => m.ProfesionalFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'profesionales/:id/editar',
        loadComponent: () => import('./components/profesionales/profesional-form/profesional-form.component').then(m => m.ProfesionalFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'registros-terapia',
        loadComponent: () => import('./components/registros-terapia/registro-terapia-list/registro-terapia-list.component').then(m => m.RegistroTerapiaListComponent)
      },
      {
        path: 'registros-terapia/nuevo',
        loadComponent: () => import('./components/registros-terapia/registro-terapia-form/registro-terapia-form.component').then(m => m.RegistroTerapiaFormComponent)
      },
      {
        path: 'registros-terapia/:id/editar',
        loadComponent: () => import('./components/registros-terapia/registro-terapia-form/registro-terapia-form.component').then(m => m.RegistroTerapiaFormComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./components/servicios/servicio-list/servicio-list.component').then(m => m.ServicioListComponent)
      },
      {
        path: 'servicios/nuevo',
        loadComponent: () => import('./components/servicios/servicio-form/servicio-form.component').then(m => m.ServicioFormComponent)
      },
      {
        path: 'servicios/:id/editar',
        loadComponent: () => import('./components/servicios/servicio-form/servicio-form.component').then(m => m.ServicioFormComponent)
      },
      {
        path: 'tipos-terapia',
        loadComponent: () => import('./components/tipos-terapia/tipo-terapia-list/tipo-terapia-list.component').then(m => m.TipoTerapiaListComponent)
      },
      {
        path: 'tipos-terapia/nuevo',
        loadComponent: () => import('./components/tipos-terapia/tipo-terapia-form/tipo-terapia-form.component').then(m => m.TipoTerapiaFormComponent)
      },
      {
        path: 'tipos-terapia/:id/editar',
        loadComponent: () => import('./components/tipos-terapia/tipo-terapia-form/tipo-terapia-form.component').then(m => m.TipoTerapiaFormComponent)
      },
      {
        path: '',
        redirectTo: 'pacientes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    redirectTo: '/pacientes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
