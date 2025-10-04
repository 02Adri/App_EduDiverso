import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent,IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonIcon,IonInput,IonSelect,IonSelectOption,IonItem,IonToggle,IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline,lockClosedOutline,personAddOutline,keyOutline, logInOutline } from 'ionicons/icons';
@Component({
  selector: 'app-modal-children',
  templateUrl: './modal-children.component.html',
  styleUrls: ['./modal-children.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,IonContent,IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonIcon,IonInput,IonSelect,IonSelectOption,IonItem,IonToggle,IonLabel],
})
export class ModalChildrenComponent  implements OnInit {
   @Input() children:any[]=[]

    nombre:string='';
    password:string='';
    esNuevo:boolean=false;
  constructor(private modalCtrl:ModalController) {
    addIcons({personOutline,lockClosedOutline,personAddOutline,keyOutline,logInOutline})
   }

  ngOnInit() {}
   
   //Funcion para cerrar el modal
   cerrar(){
    this.modalCtrl.dismiss(null,'cancel');
   }
   //Funcion para continuar
   continuar(){
     if(!this.nombre || !this.password)return;
      this.modalCtrl.dismiss({nombre:this.nombre,password:this.password,esNuevo:this.esNuevo},'ok');
    
   }
}
