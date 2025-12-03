import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profesionales',
    loadComponent: () => import('./profesionales/profesionales.component').then(m => m.ProfesionalesComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/pacientes/tipos-documento',
    loadComponent: () => import('./admin/tipos-documento/tipos-documento.component').then(m => m.TiposDocumentoComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/servicios-departamentos',
    loadComponent: () => import('./admin/servicios-departamentos/servicios-departamentos.component').then(m => m.ServiciosDepartamentosComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'terapias',
    loadComponent: () => import('./terapias/terapias.component').then(m => m.TerapiasComponent),
    canActivate: [authGuard]
  }
];

