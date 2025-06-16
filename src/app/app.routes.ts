import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'seccion-matematicas',
    loadComponent: () => import('./page/seccion-matematicas/seccion-matematicas.page').then( m => m.SeccionMatematicasPage)
  },
  {
    path: 'seccion-ly-l',
    loadComponent: () => import('./page/seccion-ly-l/seccion-ly-l.page').then( m => m.SeccionLyLPage)
  },
];
