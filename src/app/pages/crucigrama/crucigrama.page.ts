import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonInput, IonIcon, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol,
  IonProgressBar, IonAvatar, IonBadge,IonBackButton
} from '@ionic/angular/standalone';
import { GameService } from '../../service/game.service';
import { ScoreEntry } from '../../models/score-entry.model';
import { v4 as uuidv4 } from 'uuid';

let confetti: any = null;

@Component({
  selector: 'app-crucigrama',
  templateUrl: './crucigrama.page.html',
  styleUrls: ['./crucigrama.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    CommonModule, FormsModule, IonInput, IonIcon, IonList, IonItem, IonLabel,
    IonGrid, IonRow, IonCol, IonProgressBar, IonAvatar, IonBadge,IonBackButton
  ],
})
export class CrucigramaPage implements OnInit {
  // --- GAME CONFIG ---
  playerName = '';
  started = false;
  timeTotal = 90; // segundos
  timeLeft = this.timeTotal;
  timerInterval: any = null;

  // Simple crossword definition: grid rows x cols with blocked cells marked '#'
  // We'll define a small 9x9 example with words about seguridad/ambiente.
  rows = 9;
  cols = 9;
  grid: { letter: string|null, blocked: boolean, input?: string, coord: string }[][] = [];

  // Words to validate (positions defined by arrays of coords "r-c")
  placedWords: { key: string, coords: string[], answer: string, clue: string, found?: boolean }[] = [];

  score = 0;
  lives = 3;

  // Leaderboard
  leaderboard: ScoreEntry[] = [];

  // UI
  showRanking = false;
  showStartModal = true; // ask name
  showResult = false;
  resultMessage = '';

  constructor(private gs: GameService) {}

  ngOnInit() {
    this.buildTemplate();
    this.loadLeaderboard();
  }

  // Build grid template and place words
  buildTemplate() {
    // initialize grid
    this.grid = [];
    for (let r=0;r<this.rows;r++) {
      const row:any[] = [];
      for (let c=0;c<this.cols;c++) {
        row.push({ letter: null, blocked: false, input: '', coord: `${r}-${c}`});
      }
      this.grid.push(row);
    }

    // place some blocks to make it look like a crossword
    const blocks = [
      '0-2','0-6','1-2','1-6','2-0','2-4','2-8',
      '3-2','3-6','4-0','4-8','5-2','5-6','6-0','6-4','6-8','7-2','7-6','8-2','8-6'
    ];
    blocks.forEach(b => {
      const [r,c] = b.split('-').map(Number);
      this.grid[r][c].blocked = true;
    });

    // define words: coords in sequence (across or down). Answers uppercase
    // Example words: RESPETO (across), IGUALDAD (down), ECOLOGIA (across), PAZ (down), RECICLA (across)
    this.placedWords = [
      { key:'W1', coords: ['0-0','0-1','0-3','0-4','0-5','0-7'], answer:'RESPETO', clue:'Valor que promueve trato digno' },
      { key:'W2', coords: ['1-0','2-0','3-0','4-0'], answer:'IGUA', clue:'Parte de IGUALDAD (down start)' }, // short sample to fit
      { key:'W3', coords: ['2-1','2-2','2-3','2-5','2-6','2-7'], answer:'ECOLOG', clue:'Raíz de ECOLOGIA' },
      { key:'W4', coords: ['4-1','5-1','6-1'], answer:'PAZ', clue:'Ausencia de violencia' },
      { key:'W5', coords: ['6-2','6-3','6-5','6-6','6-7','6-8'], answer:'RECICL', clue:'Raíz de RECICLAR' }
    ];

    // write answer letters into grid letter for checking but keep inputs empty
    this.placedWords.forEach(w => {
      const ans = w.answer.split('');
      for (let i=0;i<w.coords.length;i++) {
        const [r,c] = w.coords[i].split('-').map(Number);
        this.grid[r][c].letter = ans[i] || '';
      }
    });
  }

  // --- GAME FLOW ---
  async startGame() {
    if (!this.playerName || this.playerName.trim().length < 1) {
      alert('Ingrese su nombre para comenzar');
      return;
    }
    this.score = 0;
    this.lives = 3;
    this.timeLeft = this.timeTotal;
    this.started = true;
    this.showStartModal = false;
    this.showResult = false;
    this.clearInputs();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.loseGame();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  clearInputs() {
    for (let r=0;r<this.rows;r++) {
      for (let c=0;c<this.cols;c++) {
        if (!this.grid[r][c].blocked) this.grid[r][c].input = '';
      }
    }
    this.placedWords.forEach(w => w.found = false);
  }

  // Validate current inputs - check each placed word
  checkWords() {
    let foundAny = false;
    this.placedWords.forEach(w => {
      if (w.found) return;
      const user = w.coords.map(coord => {
        const [r,c] = coord.split('-').map(Number);
        return (this.grid[r][c].input || '').toUpperCase();
      }).join('');
      if (user === w.answer.toUpperCase()) {
        w.found = true;
        this.score += 10 + Math.floor(this.timeLeft / 5); // bonus by time remaining
        foundAny = true;
      }
    });

    if (!foundAny) {
      // penalize a bit (lose life)
      this.lives--;
      if (this.lives <= 0) {
        this.loseGame();
      }
    } else {
      // check win
      const allFound = this.placedWords.every(w => w.found);
      if (allFound) this.winGame();
    }
  }

  async winGame() {
    this.stopTimer();
    this.started = false;
    this.resultMessage = `¡Felicidades ${this.playerName}! Puntaje: ${this.score}`;
    this.showResult = true;
    await this.gs.addScore(this.playerName, this.score);
    await this.loadLeaderboard();
    this.fireConfetti();
  }

  async loseGame() {
    this.stopTimer();
    this.started = false;
    this.resultMessage = `Juego terminado. Puntaje: ${this.score}`;
    this.showResult = true;
    await this.gs.addScore(this.playerName || 'Anónimo', this.score);
    await this.loadLeaderboard();
  }

  async loadLeaderboard() {
    this.leaderboard = await this.gs.getAll();
    // limit top 10
    this.leaderboard = this.leaderboard.slice(0, 10);
  }

  // replay
  replay() {
    this.showStartModal = true;
    this.playerName = '';
    this.started = false;
    this.clearInputs();
    this.showResult = false;
  }

  // helper to get cell by coord
  cell(r:number,c:number) {
    return this.grid[r][c];
  }

  // small UX helper: move focus automatically? We'll use simple behavior
  onInputKey(r:number, c:number, ev: any) {
    const val = (ev.target.value || '').toUpperCase().slice(-1);
    this.grid[r][c].input = val;
    // auto move right if exists and not blocked
    const nextC = c+1;
    if (val && nextC < this.cols && !this.grid[r][nextC].blocked) {
      const nextId = `${r}-${nextC}`;
      const el = document.getElementById('cell-' + nextId) as HTMLInputElement;
      if (el) el.focus();
    }
  }

  // confetti
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
    this.loadConfetti().then(() => {
      if (confetti) confetti({ particleCount: 150, spread: 160 });
      else {
        // fallback: briefly flash background
        const el = document.querySelector('ion-content');
        if (el) {
          (el as HTMLElement).style.background = 'linear-gradient(90deg,#a8ff78,#78ffd6)';
          setTimeout(()=> (el as HTMLElement).style.background = '', 1200);
        }
      }
    });
  }

  // small utility: show ranking toggle
  toggleRanking() {
    this.showRanking = !this.showRanking;
  }
}
