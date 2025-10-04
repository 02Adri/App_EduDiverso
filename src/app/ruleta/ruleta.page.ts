import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonCol, IonRow, IonList, IonBackButton, IonButtons
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { GameStorageService, RankingEntry } from '../service/game-storage.service';

interface Question {
  icon: string;
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.page.html',
  styleUrls: ['./ruleta.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonGrid, IonCol, IonRow, IonList, IonBackButton, IonButtons
  ]
})
export class RuletaPage implements OnInit {

  @ViewChild('wheel') wheel!: ElementRef;

  playerName: string = '';
  gameStarted: boolean = false;
  gameOver: boolean = false;

  icons = ['♻️','☀️','🌫️','💧','🐦','🌳'];
  questions: Question[] = [];
  currentQuestion!: Question | undefined;

  points: number = 0;
  lives: number = 3;
  timeLeft: number = 60; 
  timerInterval: any;
  spinning: boolean = false;
  resultMessage: string = '';

  ranking: RankingEntry[] = [];
  wheelRotation: number = 0;

  constructor(
    private router: Router,
    private storage: GameStorageService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadQuestions();
    this.loadRanking();
  }

  async loadRanking() {
    this.ranking = await this.storage.getRanking();
  }

  startGame() {
   /* if (!this.playerName) {
      alert('👦 Ingresa tu nombre para comenzar');
      return;
    }*/
    this.points = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.gameStarted = true;
    this.gameOver = false;
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.endGame('⏰ Tiempo agotado');
      }
    }, 1000);
  }

  loadQuestions() {
    this.questions = [
      {icon:'♻️', question:'¿Cuál es una forma de reciclar?', options:['Tirar todo a la basura','Separar residuos','Quemar plástico'], answer:'Separar residuos'},
      {icon:'☀️', question:'¿Qué energía es renovable?', options:['Solar','Carbón','Petróleo'], answer:'Solar'},
      {icon:'🌫️', question:'¿Qué contamina el aire?', options:['Árboles','Fábricas','Plantas'], answer:'Fábricas'},
      {icon:'💧', question:'¿Cómo ahorrar agua?', options:['Dejar grifo abierto','Reutilizar agua','Tirar agua limpia al suelo'], answer:'Reutilizar agua'},
      {icon:'🐦', question:'Proteger la fauna es importante porque...', options:['No es importante','Mantiene el equilibrio','Contamina el aire'], answer:'Mantiene el equilibrio'},
      {icon:'🌳', question:'¿Qué beneficio dan los árboles?', options:['Producen oxígeno','Generan basura','Contaminan'], answer:'Producen oxígeno'},
    ];
  }

  spinRoulette() {
    if (this.spinning) return;
    this.spinning = true;

    const sector = 360 / this.icons.length;
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    const spinRounds = 5 + Math.random() * 2;
    const randomAngle = (360 * spinRounds) + (randomIndex * sector) + sector/2;

    this.wheelRotation = randomAngle;

    this.renderer.setStyle(this.wheel.nativeElement, 'transition', 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)');
    this.renderer.setStyle(this.wheel.nativeElement, 'transform', `rotate(${this.wheelRotation}deg)`);

    setTimeout(() => {
      this.currentQuestion = this.questions[randomIndex];
      this.spinning = false;
    }, 4000);
  }

  async answerQuestion(option: string) {
    if (!this.currentQuestion) return;

    if(option === this.currentQuestion.answer){
      this.points+= 10;
      this.resultMessage = '✅ ¡Correcto! +10 puntos';
    } else {
      this.lives--;
      this.resultMessage = '❌ Incorrecto -1 vida';
    }

    setTimeout(async () => {
      this.resultMessage = '';
      if(this.lives <= 0) {
        clearInterval(this.timerInterval);
        this.endGame('💔 Te quedaste sin vidas');
      } else {
        this.currentQuestion = undefined;
      }
    }, 1500);
  }

  async endGame(reason: string) {
    this.resultMessage = reason;
    this.gameOver = true;
    this.gameStarted = false;
    await this.saveRanking();
  }

  async saveRanking() {
    await this.storage.saveScore({name: this.playerName, points: this.points});
    this.ranking = await this.storage.getRanking();
  }

  restartGame() {
    this.playerName = '';
    this.points = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.gameOver = false;
    this.gameStarted = false;
  }
}
