import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigir al login
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  console.log('adminGuard check:', { isAuthenticated, isAdmin, token: authService.getToken() });

  if (isAuthenticated && isAdmin) {
    return true;
  }

  // Si no es admin, redirigir
  console.log('adminGuard: Acceso denegado, redirigiendo al login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

