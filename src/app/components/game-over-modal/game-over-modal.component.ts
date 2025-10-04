import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {IonHeader,IonToolbar,IonContent,IonButton,IonItem,IonLabel,IonButtons,IonCard,IonCardHeader,IonCardContent,IonCardTitle,IonInput,IonTitle} from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.scss'],
  imports:[CommonModule,IonHeader,IonToolbar,IonContent,IonButton,IonItem,IonLabel,IonButtons,IonCard,IonCardHeader,IonCardContent,IonCardTitle,IonInput,IonTitle,FormsModule]
})
export class GameOverModalComponent {
  @Input() score!: number;
  @Input() level!: number;
  @Input() tips!: string[];

  playerName = '';
  chosenTip = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(){
    this.chosenTip = this.tips && this.tips.length ? this.tips[Math.floor(Math.random()*this.tips.length)] : '';
  }

  save() {
    const name = this.playerName?.trim() || 'Anon';
    // dismiss returning object
    this.modalCtrl.dismiss({ action: 'save', name });
  }

  close() {
    this.modalCtrl.dismiss({ action: 'close' });
  }
}
