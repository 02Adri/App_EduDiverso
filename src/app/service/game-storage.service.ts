import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

export interface RankingEntry {
  name: string;
  points: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameStorageService {

  private RANKING_KEY = 'ranking';

  constructor() { }

  // Guardar puntaje
  async saveScore(entry: RankingEntry) {
    const stored = await this.getRanking();
    stored.push(entry);
    stored.sort((a, b) => b.points - a.points);
    await Storage.set({ key: this.RANKING_KEY, value: JSON.stringify(stored) });
  }

  // Obtener ranking completo
  async getRanking(): Promise<RankingEntry[]> {
    const ret = await Storage.get({ key: this.RANKING_KEY });
    return ret.value ? JSON.parse(ret.value) : [];
  }

  // Limpiar ranking
  async clearRanking() {
    await Storage.remove({ key: this.RANKING_KEY });
  }
}
