import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router'
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
     <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text="Volver" icon="chevron-back-outline"></ion-back-button>
        </ion-buttons>
        <ion-title>Acceso Biblioteca</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="login-content">
      <div class="login-wrapper">
        <div class="login-container animate__animated animate__fadeInDown">

          <div class="login-icon">
            <ion-icon name="book-outline"></ion-icon>
          </div>

          <h2 class="login-title">Bienvenido</h2>
          <p class="login-subtitle">Accede para continuar</p>

          <ion-item class="input-item">
            <ion-icon slot="start" name="person-circle-outline"></ion-icon>
            <ion-input placeholder="Nombre" [(ngModel)]="name"></ion-input>
          </ion-item>

          <ion-item class="input-item">
            <ion-icon slot="start" name="people-outline"></ion-icon>
            <ion-select placeholder="Selecciona rol" [(ngModel)]="role">
              <ion-select-option value="facilitador">Facilitador</ion-select-option>
              <ion-select-option value="niño">Niño</ion-select-option>
              <ion-select-option value="niña">Niña</ion-select-option>
              <ion-select-option value="invitado">Invitado</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button expand="block" shape="round" class="login-btn" (click)="login()">
            <ion-icon slot="start" name="log-in-outline"></ion-icon>
            Ingresar
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles:[
    `
    .login-content {
      --background: linear-gradient(135deg, #74ABE2, #5563DE);
    }

    /* Wrapper que ocupa toda la pantalla */
    .login-wrapper {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      background: white;
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0px 6px 15px rgba(0,0,0,0.2);
      text-align: center;
      animation-duration: 1s;
    }

    .login-icon ion-icon {
      font-size: 64px;
      color: #5563DE;
      margin-bottom: 10px;
      animation: bounce 2s infinite;
    }

    .login-title {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 5px 0;
      color: #333;
    }

    .login-subtitle {
      color: #777;
      margin-bottom: 20px;
      font-size: 0.95rem;
    }

    .input-item {
      margin-bottom: 15px;
      border-radius: 12px;
      --background: #f5f6fa;
    }

    .login-btn {
      margin-top: 15px;
      --background: #5563DE;
      --background-activated: #3b4bcc;
      --border-radius: 25px;
      font-weight: bold;
      box-shadow: 0px 4px 12px rgba(0,0,0,0.2);
    }

    /* Animación de icono */
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-8px);
      }
      60% {
        transform: translateY(-4px);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-container {
        margin: 0 15px;
        padding: 20px;
      }
    }

    @media (min-width: 1024px) {
      .login-container {
        max-width: 500px;
        padding: 30px;
      }
    }
    `
  ]
})

export class LoginPage{
   name='';
   role:any='invitado'

   constructor(private userService:UserService,private router:Router){}

   //funcion de login
   login(){
      if(!this.name) return
      this.userService.login(this.name,this.role)
      this.router.navigateByUrl('/library')
   }
}