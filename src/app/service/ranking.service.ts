import { Injectable } from '@angular/core';

export interface ScoreEntry {
  name: string;
  score: number;
  level: number;
  date: string; // ISO
}

const STORAGE_KEY = 'recolector_verde_ranking_v1';

@Injectable({ providedIn: 'root' })
export class RankingService {
  private maxEntries = 10;

  guardar(entry: ScoreEntry) {
    const arr = this.getAll();
    arr.push(entry);
    arr.sort((a, b) => b.score - a.score);
    const trimmed = arr.slice(0, this.maxEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  getAll(): ScoreEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
    } catch {
      return [];
    }
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
