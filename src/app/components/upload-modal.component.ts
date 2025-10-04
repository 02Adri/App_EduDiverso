import { Component } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../service/library.service';
import { UserService } from '../service/user.service';
import { LibraryItem } from '../models/library.models';
import Swal from 'sweetalert2'
function genId() {
  return Math.random().toString(36).slice(2, 9);
}

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Subir Libro / Audiolibro</ion-title>
      <ion-buttons slot="end"><ion-button (click)="dismiss()">Cerrar</ion-button></ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked">Tipo</ion-label>
      <ion-segment [(ngModel)]="mediaKind">
        <ion-segment-button value="book">Libro(PDF/Imagen)</ion-segment-button>
        <ion-segment-button value="audio">Audiolibro</ion-segment-button>
      </ion-segment>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Título</ion-label>
      <ion-input [(ngModel)]="title"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Descripción</ion-label>
      <ion-textarea [(ngModel)]="description"></ion-textarea>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Categoría</ion-label>
      <ion-select [(ngModel)]="category">
        <ion-select-option *ngFor="let c of categories" [value]="c">{{c}}</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Archivo</ion-label>
      <input type="file" [accept]="mediaKind === 'audio' ? 'audio/*' : 'application/pdf,image/*'" (change)="onFile($event)"/>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Portada (opcional)</ion-label>
      <input type="file" accept="image/*" (change)="onCover($event)"/>
      <div *ngIf="coverFile" style="margin-top:8px">
        <img [src]="coverFile" style="width:90px;height:120px;object-fit:cover;border-radius:8px"/>
      </div>
    </ion-item>

    <div style="margin-top:16px">
      <ion-button expand="full" (click)="submit()">Subir a Biblioteca</ion-button>
    </div>
  </ion-content>
  `
})
export class UploadModalComponent {
  mediaKind: 'book' | 'audio' = 'book';
  title = '';
  description = '';
  category = 'Cuentos';
  categories = ['Cuentos', 'Ciencia', 'Matemáticas', 'Arte', 'Audiolibros', 'Destacados'];
  coverFile?: string;
  fileData?: { base64: string; filename: string; mime: string };

  constructor(
    private modal: ModalController,
    private svc: LibraryService,
    private userService: UserService,
    private toast: ToastController
  ) {}

  dismiss() { this.modal.dismiss(); }

  private toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = e => rej(e);
      reader.readAsDataURL(file);
    });
  }

  async onCover(ev: any) {
    const f: File = ev.target.files?.[0];
    if (!f) return;
    this.coverFile = await this.toBase64(f);
  }

  async onFile(ev: any) {
    const f: File = ev.target.files?.[0];
    if (!f) return;
    const base64WithPrefix = await this.toBase64(f);
    const base64 = base64WithPrefix.split(',')[1]; // ⚡ quitar "data:...;base64,"
    this.fileData = { base64, filename: f.name, mime: f.type };
  }

  async submit() {
  const user = this.userService.getUser();
  if (!user) {
    await Swal.fire({
      title: 'Error',
      text: 'Identifícate antes de subir',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false,
      heightAuto: false,
      customClass:{
        popup:'custom-alert',
      },
      backdrop:true,
      
    });
    return;
  }

  if (!this.title || !this.fileData) {
    await Swal.fire({
      title: 'Error',
      text: 'Completa título y archivo',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false,
      heightAuto: false,
      customClass:{
        popup:'custom-alert',
      },
      backdrop:true,
    });
    return;
  }

  const newId = genId();
  const mime = this.fileData.mime;
  const type = mime.includes('pdf')
    ? 'pdf'
    : mime.includes('audio')
    ? 'audio'
    : mime.includes('image')
    ? 'image'
    : 'other';

  const item: LibraryItem = {
    id: newId,
    title: this.title,
    description: this.description,
    category: this.category,
    uploader: user.name,
    date: new Date().toISOString(),
    coverBase64: this.coverFile,
    filename: `${newId}-${this.fileData.filename}`,
    mime: this.fileData.mime,
    type,
    fileBase64: undefined
  };

  await this.svc.add(item, this.fileData.base64);

  await Swal.fire({
    title: '¡Éxito!',
    text: 'Tu archivo se ha subido correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    scrollbarPadding: false,
    heightAuto: false,
      customClass:{
        popup:'custom-alert',
      },
      backdrop:true,
  });

  this.dismiss();
}

}
