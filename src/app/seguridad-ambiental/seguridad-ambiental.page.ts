import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton,IonButton,IonIcon,IonCard,IonCardTitle,IonCardSubtitle,IonCardHeader} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import {NavController} from '@ionic/angular'

@Component({
  selector: 'app-seguridad-ambiental',
  templateUrl: './seguridad-ambiental.page.html',
  styleUrls: ['./seguridad-ambiental.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonBackButton,IonButton,IonIcon,IonCard,IonCardTitle,IonCardSubtitle,IonCardHeader]
})
export class SeguridadAmbientalPage implements OnInit {

  constructor(private navCtrl:NavController) { 
    addIcons({informationCircleOutline})
  }

  ngOnInit() {
  }

  //Navegar a game
  navegarJuego(){
    this.navCtrl.navigateForward('/ruleta')
  }
  navegarCrucigrama(){
    this.navCtrl.navigateForward('/crucigrama')
  }
  
  navegarSopaLetras(){
    this.navCtrl.navigateForward('/sopa-letras-ambiental')
  }
}
