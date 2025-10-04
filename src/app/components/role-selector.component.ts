import{Component} from '@angular/core'
import{IonicModule,ToastController} from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { UserService } from '../service/user.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <div class="role-bar">
    <!-- Avatar e input -->
    <div class="left">
      <ion-icon name="person-circle-outline" class="avatar"></ion-icon>
      <ion-input
        [(ngModel)]="name"
        placeholder="Tu nombre"
        class="name-input"
      ></ion-input>
    </div>

    <!-- Select con iconos -->
    <div class="center">
      <ion-select [(ngModel)]="role" interface="popover" class="role-select">
        <ion-select-option value="facilitador">👨‍🏫 Facilitador</ion-select-option>
        <ion-select-option value="nino">👦 Niño</ion-select-option>
        <ion-select-option value="nina">👧 Niña</ion-select-option>
        <ion-select-option value="invitado">🌟 Invitado</ion-select-option>
      </ion-select>
    </div>

    <!-- Botones -->
    <div class="right">
      <ion-button fill="clear" (click)="apply()" class="btn-apply">
        🚀Usar 
      </ion-button>
      <ion-button fill="clear" color="danger" (click)="logout()" class="btn-logout">
        🔒Salir
      </ion-button>
    </div>
  </div>
  `,
  styles:[
    `
    /* ===== Barra Principal ===== */
  .role-bar {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: 100%;
    max-width: 1200px;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 15px;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);

    animation: slideDown 0.6s ease;
  }

  /* ===== Secciones ===== */
  .left, .center, .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Avatar */
  .avatar {
    font-size: 32px;
    color: #fff;
    animation: pulse 2s infinite;
  }

  /* Input nombre */
  .name-input {
    --background: #ffffff;
    --border-radius: 8px;
    height: 38px;
    padding: 0 8px;
    font-size: 14px;
    min-width: 100px;
    max-width: 180px;
  }

  /* Select */
  .role-select {
    --background: #fff;
    --border-radius: 8px;
    font-size: 14px;
    min-width: 120px;
  }

  /* Botones */
  .btn-apply, .btn-logout {
    font-size: 20px;
    --padding-start: 6px;
    --padding-end: 6px;
  }

  .btn-apply {
    --color: #fff;
    animation: bounce 2s infinite;
  }

  .btn-logout {
    --color: #ff4e50;
  }

  /* ===== Responsive ===== */
  @media (max-width: 600px) { /* móvil */
    .role-bar {
      flex-direction: column;
      height: auto;
      padding: 10px;
      border-radius: 0 0 20px 20px;
    }
    .left, .center, .right {
      width: 100%;
      justify-content: center;
    }
    .name-input {
      max-width: 100%;
    }
  }

  @media (min-width: 601px) and (max-width: 1024px) { /* tablet */
    .name-input {
      max-width: 150px;
    }
    .role-select {
      min-width: 140px;
    }
  }

  /* ===== Animaciones ===== */
  @keyframes slideDown {
    from { transform: translate(-50%, -60px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

    `
  ]
})

export class RoleSelectorComponent{
    name=''
    role:any='invitado'
    expanded=false;
    isMobile=false;

    constructor(private userService:UserService,private toastCtrl:ToastController){
      const u=this.userService.getUser();
      if(u){this.name=u.name;this.role=u.role;}
      
    }
      
   
    async apply(){
        if(!this.name){
            const t=await this.toastCtrl.create({message:'Ingresa tu nombre',duration:1500}); 
            await t.present(); 
            return;
        }
        this.userService.login(this.name,this.role)
        const t=await this.toastCtrl.create({message:`Hola ${this.name} (${this.role})`,duration:1500}); 
        await t.present();
        this.expanded = false;
    }


    logout(){
        this.userService.logout()
        this.name='';
        this.role='invitado'
        this.expanded = false;
    }
}