import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { BitacoraEntry } from '../models/bitacora-entry.model';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const STORE_KEY = 'bitacora_entries_v2';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'mi_app_bitacora',
      storeName: 'entries',
      description: 'Bitacora entries using localForage'
    });
  }

  private async getAllRaw(): Promise<BitacoraEntry[]> {
    const raw = (await this.store.getItem<BitacoraEntry[]>(STORE_KEY)) || [];
    return raw.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  async getAll(): Promise<BitacoraEntry[]> {
    return await this.getAllRaw();
  }

  private async saveAll(entries: BitacoraEntry[]) {
    await this.store.setItem(STORE_KEY, entries);
  }

  async add(entry: BitacoraEntry) {
    const entries = await this.getAllRaw();
    entries.unshift(entry);
    await this.saveAll(entries);
  }

  async update(updated: BitacoraEntry) {
    const entries = await this.getAllRaw();
    const idx = entries.findIndex(e => e.id === updated.id);
    if (idx > -1) {
      entries[idx] = updated;
      await this.saveAll(entries);
    }
  }

  async remove(id: string) {
    const entries = (await this.getAllRaw()).filter(e => e.id !== id);
    await this.saveAll(entries);
  }

  async clearAll() {
    await this.saveAll([]);
  }

  async exportJSON(): Promise<string> {
    const entries = await this.getAllRaw();
    return JSON.stringify(entries, null, 2);
  }

  async importJSON(json: string) {
    try {
      const parsed: BitacoraEntry[] = JSON.parse(json);
      if (Array.isArray(parsed)) {
        const existing = await this.getAllRaw();
        const merged = parsed.concat(existing);
        await this.saveAll(merged);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  // ------------------ IMÁGENES ------------------

  async saveImageFromBase64(dataUrl: string): Promise<string> {
    if (!dataUrl) throw new Error('No data');
    const parts = dataUrl.split(',');
    const base64 = parts.length > 1 ? parts[1] : parts[0];
    const id = uuidv4();
    const fileName = `bitacora_${id}.jpeg`;

    if (Capacitor.isNativePlatform()) {
      // Guardar en Filesystem (Android/iOS)
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Data,
        recursive: true,
      });
      return result.uri || fileName;
    } else {
      // En web: guardamos el dataUrl completo
      return dataUrl;
    }
  }

  getWebPath(fileUri: string) {
    if (!fileUri) return '';
    // Si es base64, lo devolvemos tal cual
    if (fileUri.startsWith('data:image')) {
      return fileUri;
    }
    // Si es nativo, convertimos la ruta
    try {
      return Capacitor.convertFileSrc(fileUri);
    } catch (e) {
      return fileUri;
    }
  }

  async readImageAsBase64(fileUriOrName: string): Promise<string> {
    try {
      const file = await Filesystem.readFile({
        path: fileUriOrName,
        directory: Directory.Data
      });
      return `data:image/jpeg;base64,${file.data}`;
    } catch (err) {
      console.warn('No se pudo leer imagen como base64', err);
      return '';
    }
  }
}
