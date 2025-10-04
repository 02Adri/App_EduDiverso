import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from '@ionic/angular'
import {IonHeader,IonToolbar,IonTitle,IonIcon,IonButtons,IonButton,IonContent,IonList,IonListHeader,IonItem, IonLabel } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { timeOutline,closeOutline } from 'ionicons/icons';
@Component({
  selector: 'app-estadisticas-modal',
  templateUrl: './estadisticas-modal.component.html',
  styleUrls: ['./estadisticas-modal.component.scss'],
  standalone: true,
  imports:[IonHeader,IonToolbar,IonTitle,IonIcon,IonButtons,IonButton,IonContent,IonList,IonListHeader,IonItem,IonLabel],
})
export class EstadisticasModalComponent  implements OnInit {
    @Input() totalIngresos!:number;
    @Input() ingresosHoy!:number;
    @Input()  porcentaje!:number;
    @Input() ultimaFecha!: string;
    @Input()  registro!:any[];

  constructor(private modalCtrl:ModalController) {
    addIcons({timeOutline,closeOutline})
   }

  ngOnInit() {}
    //Funcion para cerrar el modal
    cerrar(){
      this.modalCtrl.dismiss();
    }
}
