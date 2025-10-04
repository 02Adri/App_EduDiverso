import { Component } from '@angular/core';
import { RankingService, ScoreEntry } from '../../service/ranking.service';
import {IonHeader,IonToolbar,IonContent,IonCard,IonItem,IonLabel,IonAvatar,IonButton,IonTitle} from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
 selector:'app-ranking-page',
 templateUrl:'./ranking-page.html', 
 styleUrls:['./ranking-page.scss'],
 imports:[IonHeader,IonToolbar,IonContent,IonCard,IonItem,IonLabel,IonAvatar,IonButton,CommonModule,FormsModule,IonTitle]
})
export class RankingPage {
  rankings: ScoreEntry[] = [];
  constructor(private ranking: RankingService){ this.rankings = this.ranking.getAll(); }

  clear(){ this.ranking.clear(); this.rankings = []; }
}
