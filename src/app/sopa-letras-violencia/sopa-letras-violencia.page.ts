import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonItem, IonInput,
  IonLabel, IonChip, IonList, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { PlaceWord, Position } from '../models/word-grid.model';
import { LeaderboardService,LeaderboardEntry } from '../service/leaderboard.service';

let confetti: any = null;

@Component({
  selector: 'app-sopa-letras-violencia',
  templateUrl: './sopa-letras-violencia.page.html',
  styleUrls: ['./sopa-letras-violencia.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonItem, IonInput,
  IonLabel, IonChip, IonList, IonIcon, IonBackButton, CommonModule, FormsModule]
})
export class SopaLetrasViolenciaPage implements OnInit, OnDestroy {

  rows = 12;
  cols = 12;

  grid: string[][] = [];
  placedWords: PlaceWord[] = [];
  selectedPositions: Position[] = [];

  score = 0;
  lives = 3;
  timeLeft = 120;
  timerInterval: any;

  gameState: 'playing' | 'won' | 'lost' = 'playing';
  nameForRanking = '';


   leaderboard: LeaderboardEntry[] = []; 
  // Palabras clave
  words = [
    'RESPETO','IGUALDAD','DIALOGO','PAZ','NOALVIOLENCIA',
    'EMPATIA','SOLIDARIDAD','EQUIDAD','DERECHOS','INCLUSION',
  ];

  constructor(public lb: LeaderboardService) {}

  ngOnInit() {
    this.initGrid();
    this.startTimer();
    this.loadLeaderboard()
  }

  ngOnDestroy() { this.stopTimer(); }

  initGrid() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );
    this.placedWords = [];
    this.words.forEach((w) => this.placeWord(w));
    this.selectedPositions = [];
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 120;
    this.gameState = 'playing';
  }

  placeWord(word: string) {
    const wordChars = word.split('');
    const row = Math.floor(Math.random() * this.rows);
    let col = Math.floor(Math.random() * (this.cols - wordChars.length));
    const positions: Position[] = [];
    wordChars.forEach((ch, i) => {
      this.grid[row][col + i] = ch;
      positions.push({ r: row, c: col + i });
    });
    this.placedWords.push({ word, positions, found: false });
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.loseGame();
    }, 1000);
  }
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  selectCell(r: number, c: number) {
    const already = this.isSelected(r, c);
    if (!already) {
      this.selectedPositions.push({ r, c });
      this.checkSelection();
    }
  }

  checkSelection() {
    for (const word of this.placedWords) {
      if (!word.found && this.matchesWord(word)) {
        word.found = true;
        this.score += 10 + Math.floor(this.timeLeft / 10); // bonus
        this.selectedPositions = [];
        this.checkWin();
        return;
      }
    }
    // si no coincide, quitar vida
    if (this.selectedPositions.length > 5) {
      this.lives--;
      this.selectedPositions = [];
      if (this.lives <= 0) this.loseGame();
    }
  }

  matchesWord(word: PlaceWord): boolean {
    return word.positions.every(p =>
      this.selectedPositions.some(sel => sel.r === p.r && sel.c === p.c)
    );
  }

  checkWin() {
    const allFound = this.placedWords.every((p) => p.found);
    if (allFound) this.winGame();
  }

  async winGame() {
    this.gameState = 'won';
    this.stopTimer();
    await this.loadConfetti();
    this.fireConfetti();
  }

  loseGame() {
    this.gameState = 'lost';
    this.stopTimer();
  }

  reset() {
    this.initGrid();
    this.startTimer();
  }

   loadLeaderboard() {
    this.leaderboard = this.lb.getAll();
  }
  saveToLeaderboard() {
    if (!this.nameForRanking) this.nameForRanking = 'Anónimo';
    this.lb.add({
      name: this.nameForRanking,
      score: this.score,
      date: new Date().toISOString(),
    });
    this.loadLeaderboard();
  }

  async loadConfetti() {
    if (!confetti) {
      try {
        confetti = (await import('canvas-confetti')).default;
      } catch (e) {
        confetti = null;
      }
    }
  }
  fireConfetti() {
    if (confetti) {
      confetti({ particleCount: 150, spread: 180 });
    } else {
      const el = document.querySelector('.confetti-fallback') as HTMLElement;
      if (el) {
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 3000);
      }
    }
  }

  isSelected(r: number, c: number) {
    return this.selectedPositions.some((p) => p.r === r && p.c === c);
  }


}
