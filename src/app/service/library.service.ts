import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import localforage from 'localforage';
import { LibraryItem } from '../models/library.models';

const STORAGE_KEY = 'virtual_library_items_v1';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private items: LibraryItem[] = [];
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    this.init();
  }

  private async init() {
    if (!this.isNative) {
      localforage.config({
        name: 'VirtualLibrary',
        storeName: 'files'
      });
    }
    await this.loadFromStorage();
    if (!this.items.length) this.seed();
  }

  private async saveToStorage() {
    try {
      const cleanItems = this.items.map(i => {
        const { fileBase64, coverBase64, ...rest } = i;
        return rest;
      });
      await localforage.setItem(STORAGE_KEY, cleanItems);
    } catch (error) {
      console.error('❌ No se pudo guardar en localforage', error);
    }
  }

  private async loadFromStorage() {
    try {
      const data = await localforage.getItem<LibraryItem[]>(STORAGE_KEY);
      this.items = data || [];
    } catch (error) {
      console.error('❌ Error cargando biblioteca desde localforage', error);
      this.items = [];
    }
  }

  async saveFile(filename: string, base64Data: string): Promise<void> {
    if (this.isNative) {
      await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Data
      });
    } else {
      await localforage.setItem(filename, base64Data);
    }
  }

  async getFile(filename: string): Promise<string | null> {
    try {
      if (this.isNative) {
        const result = await Filesystem.readFile({ path: filename, directory: Directory.Data });
        return result.data as string; 
      } else {
        return await localforage.getItem<string>(filename);
      }
    } catch (error) {
      console.error('❌ Error al leer archivo', error);
      return null;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      if (this.isNative) {
        await Filesystem.deleteFile({ path: filename, directory: Directory.Data });
      } else {
        await localforage.removeItem(filename);
      }
    } catch (error) {
      console.error('❌ Error al borrar archivo', error);
    }
  }

  getAll(): LibraryItem[] {
    return this.items;
  }

  getById(id: string): LibraryItem | undefined {
    return this.items.find(i => i.id === id);
  }

  async add(item: LibraryItem, fileData?: string) {
    // ⚡ Evitar duplicados por filename
    const exists = this.items.find(i => i.filename === item.filename);
    if (exists) return;

    if (fileData && item.filename) {
      await this.saveFile(item.filename, fileData);
    }

    this.items.unshift(item);
    await this.saveToStorage();
  }

  async update(item: LibraryItem) {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.items[index] = item;
      await this.saveToStorage();
    }
  }

  async remove(id: string) {
    const index = this.items.findIndex(i => i.id === id);
    if (index > -1) {
      const item = this.items[index];
      if (item.filename) await this.deleteFile(item.filename);
      this.items.splice(index, 1);
      await this.saveToStorage();
    }
  }

  private seed() {
    this.items = [
      {
        id: 'demo-1',
        title: 'Cuentos para niños',
        description: 'Pequeñas historias para aprender valores.',
        category: 'Cuentos',
        uploader: 'Equipo Biblioteca',
        date: new Date().toISOString(),
        filename: 'demo-1.pdf',
        mime: 'application/pdf',
        type: 'pdf'
      }
    ];
    this.saveToStorage();
  }
}
