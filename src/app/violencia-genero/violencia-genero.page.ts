import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonBackButton, IonButtons,IonButton,IonIcon,IonCard,IonCardTitle,IonCardSubtitle,IonCardHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import {NavController} from '@ionic/angular';
@Component({
  selector: 'app-violencia-genero',
  templateUrl: './violencia-genero.page.html',
  styleUrls: ['./violencia-genero.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonBackButton,IonButton,IonIcon,IonCard,IonCardTitle,IonCardSubtitle,IonCardHeader]
})
export class ViolenciaGeneroPage implements OnInit {

  constructor(private navCtrl: NavController) { 
    addIcons({
      informationCircleOutline
    })
  }

  ngOnInit() {
  }
  abrirJuego(){
    this.navCtrl.navigateForward('/juego-estereotipos');
  }
   
  abrirJuegoSapito(){
    this.navCtrl.navigateForward('/juego-sapito');
  }
  abrirJuegoSopaLetras(){
    this.navCtrl.navigateForward('/sopa-letras-violencia')
  }
}
