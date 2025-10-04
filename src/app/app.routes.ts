import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { RoleGuard } from './guards/role.guard'
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
    path: 'seguridad-ambiental',
    loadComponent: () => import('./seguridad-ambiental/seguridad-ambiental.page').then( m => m.SeguridadAmbientalPage)
  },
  {
    path: 'violencia-genero',
    loadComponent: () => import('./violencia-genero/violencia-genero.page').then( m => m.ViolenciaGeneroPage)
  },
  {
    path: 'recursos-maestros',
    loadComponent: () => import('./recursos-maestros/recursos-maestros.page').then( m => m.RecursosMaestrosPage)
  },
  {
    path: 'evaluacion',
    loadComponent: () => import('./evaluacion/evaluacion.page').then( m => m.EvaluacionPage)
  },
  {
    path: 'juego-estereotipos',
    loadComponent: () => import('./juego-estereotipos/juego-estereotipos.page').then( m => m.JuegoEstereotiposPage)
  },
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  { path: 'library', loadComponent: () => import('./pages/library.page').then(m => m.LibraryPage) },
  { path: 'login', loadComponent: () => import('./pages/login.page').then(m => m.LoginPage) },
  // ejemplo de ruta protegida (no es estrictamente necesaria porque el modal impide subir si no hay rol)
  {
    path: 'upload',
    loadComponent: () => import('./components/upload-modal.component').then(m => m.UploadModalComponent),
    canActivate: [() => inject(RoleGuard).canActivate()]
  },
  {
    path: 'juego-sapito',
    loadComponent: () => import('./juego-sapito/juego-sapito.page').then( m => m.JuegoSapitoPage)
  },
  {
    path: 'game-page',
    loadComponent: () => import('./pages/game-page/game-page').then( m => m.GamePage)
  },
 
  
  {
    path: 'crucigrama',
    loadComponent: () => import('./pages/crucigrama/crucigrama.page').then( m => m.CrucigramaPage)
  },
  {
    path: 'sopa-letras-violencia',
    loadComponent: () => import('./sopa-letras-violencia/sopa-letras-violencia.page').then( m => m.SopaLetrasViolenciaPage)
  },  {
    path: 'ruleta',
    loadComponent: () => import('./ruleta/ruleta.page').then( m => m.RuletaPage)
  },
  {
    path: 'sopa-letras-ambiental',
    loadComponent: () => import('./sopa-letras-ambiental/sopa-letras-ambiental.page').then( m => m.SopaLetrasAmbientalPage)
  }

  
];
