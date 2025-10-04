import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { ScoreEntry } from '../models/score-entry.model';

const LB_KEY = 'crucigrama_leaderboard_v1';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'crucigrama_app',
      storeName: 'leaderboard',
      description: 'Leaderboard storage for Crucigrama'
    });
  }

  private async getAllRaw(): Promise<ScoreEntry[]> {
    const raw = (await this.store.getItem<ScoreEntry[]>(LB_KEY)) || [];
    return raw.sort((a,b) => b.score - a.score || +new Date(b.date) - +new Date(a.date));
  }

  async getAll(): Promise<ScoreEntry[]> {
    return await this.getAllRaw();
  }

  async addScore(name: string, score: number) {
    const entry: ScoreEntry = {
      id: uuidv4(),
      name: name || 'Anónimo',
      score,
      date: new Date().toISOString()
    };
    const arr = await this.getAllRaw();
    arr.unshift(entry);
    await this.store.setItem(LB_KEY, arr);
  }

  async clear() {
    await this.store.removeItem(LB_KEY);
  }

  async exportJSON(): Promise<string> {
    const arr = await this.getAllRaw();
    return JSON.stringify(arr, null, 2);
  }

  async importJSON(json: string) {
    try {
      const parsed: ScoreEntry[] = JSON.parse(json);
      if (Array.isArray(parsed)) {
        const existing = await this.getAllRaw();
        const merged = parsed.concat(existing);
        await this.store.setItem(LB_KEY, merged);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}
