import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LibraryItem } from '../models/library.models';
import { LibraryService } from '../service/library.service';

@Component({
  selector: 'app-preview-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>{{item?.title}}</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismiss()">Cerrar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding" *ngIf="fileUrl">

    <ng-container [ngSwitch]="item?.type">

      <!-- PDF -->
      <div *ngSwitchCase="'pdf'" style="height:90vh">
        <iframe [src]="fileUrl" width="100%" height="100%" style="border:none"></iframe>
      </div>

      <!-- Imagen -->
      <div *ngSwitchCase="'image'" class="ion-text-center">
        <img [src]="fileUrl" style="max-width:100%;border-radius:8px"/>
      </div>

      <!-- Audio -->
      <div *ngSwitchCase="'audio'" class="ion-text-center">
        <audio controls [src]="fileUrl" style="width:100%"></audio>
      </div>

      <!-- Otro -->
      <p *ngSwitchDefault>No se puede mostrar este tipo de archivo.</p>

    </ng-container>

  </ion-content>
  `
})
export class PreviewModalComponent {
  @Input() item?: LibraryItem;
  fileUrl?: SafeResourceUrl;

  constructor(
    private modal: ModalController,
    private svc: LibraryService,
    private sanitizer: DomSanitizer
  ) {}

  async ionViewWillEnter() {
    if (!this.item) return;
    const base64 = await this.svc.getFile(this.item.id);
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:${this.item.mime};base64,${base64}`
    );
  }

  dismiss() {
    this.modal.dismiss();
  }
}
