import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton,IonButton,IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-recursos-maestros',
  templateUrl: './recursos-maestros.page.html',
  styleUrls: ['./recursos-maestros.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonBackButton,IonButton,IonIcon]
})
export class RecursosMaestrosPage implements OnInit {

  constructor() {
    addIcons({informationCircleOutline})
   }

  ngOnInit() {
  }

}
