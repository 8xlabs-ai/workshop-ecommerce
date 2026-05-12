import type { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard.js';

export const accountRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard.component.js').then((m) => m.AccountDashboardComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./orders-list.component.js').then((m) => m.OrdersListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login.component.js').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register.component.js').then((m) => m.RegisterComponent),
  },
];
