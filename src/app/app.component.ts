import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonItem, IonLabel, IonIcon, IonHeader, IonToolbar, IonTitle, IonItemDivider, IonList,IonMenu,IonContent } from '@ionic/angular/standalone';
import { addIcons} from 'ionicons';
import {SplashScreen} from '@capacitor/splash-screen'
import { analyticsOutline, documentTextOutline, downloadOutline, handLeftOutline, leafOutline } from 'ionicons/icons';
import {NavController,MenuController,ModalController} from '@ionic/angular'
import { AuthService } from './service/auth.service';  
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {LoginModalComponent} from './login-modal/login-modal.component';
import { ModalChildrenComponent } from './modal-children/modal-children.component';
import {IonicModule} from '@ionic/angular';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonList, IonItemDivider, IonTitle, IonToolbar, IonHeader, IonIcon, IonLabel, IonItem, IonApp, IonRouterOutlet,IonMenu,IonContent,IonicModule,RouterModule],
})
export class AppComponent {
     constructor(private navCtrl:NavController,private menu:MenuController, private router:Router, private authService:AuthService,private modalCtrl:ModalController) {
    this.showSplash();
      addIcons({leafOutline,handLeftOutline,documentTextOutline,downloadOutline,analyticsOutline})
  }


  //Funcion para mostrar el SplashScreen
  async showSplash(){
    await SplashScreen.show({
  autoHide:true,
  showDuration:3000,
});
  }

//LLama a este metodo desde click del ion-item
async onMenuItemClick(page:string){
  const maestros=this.authService.getMaestros() ||[];
   const modal=await this.modalCtrl.create({
    component:LoginModalComponent,
    componentProps:{maestros},
  })
  await modal.present();
  const {data,role}=await modal.onDidDismiss();

  if(role==='ok' && data){
    const {nombre,password,esNuevo}=data;

    if(esNuevo){
      this.authService.addMaestro(nombre,password);
      this.navCtrl.navigateRoot(page)
    }else{
      if(this.authService.validarMaestro(nombre,password)){
        this.menu.close();
        this.navCtrl.navigateRoot(page)
      }else{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'Usuario o contraseña incorrecta',
          confirmButtonText:'Aceptar',
          scrollbarPadding:false,
          heightAuto: false,
          customClass:{
            popup:'custom-alert'
          },
          backdrop:true,
        });
      }
    }
  }
}

//navegacion sin registro
async  navigateToClick(page:string){
   const children=this.authService.getChildren() ||[];
   const modal=await this.modalCtrl.create({
    component:ModalChildrenComponent,
    componentProps:{children},
  })
  await modal.present();
  const {data,role}=await modal.onDidDismiss();

  if(role==='ok' && data){
    const {nombre,password,esNuevo}=data;

    if(esNuevo){
      this.authService.addChildren(nombre,password);
      this.navCtrl.navigateRoot(page)
    }else{
      if(this.authService.validarChildren(nombre,password)){
        this.menu.close();
        this.navCtrl.navigateRoot(page)
      }else{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'Usuario o contraseña incorrecta',
          confirmButtonText:'Aceptar',
          scrollbarPadding:false,
          heightAuto: false,
          customClass:{
            popup:'custom-alert'
          },
          backdrop:true,
        });
      }
    }
  }
 }
}
