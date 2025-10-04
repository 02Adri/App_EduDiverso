import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LibraryItem } from '../models/library.models';  
import { UserService } from '../service/user.service';
import { LibraryService } from '../service/library.service';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
  <div class="shelf-container">
  <div class="shelf">
    <div class="book">
      <div class="cover">
        <img *ngIf="item.coverBase64; else noCover" [src]="item.coverBase64" alt="Portada" />
        <ng-template #noCover>
          <div class="default-cover">
            {{ item.type === 'audio' ? '🎧' : '📘' }}
          </div>
        </ng-template>
      </div>

      <div class="book-info">
        <h3>{{ item.title }}</h3>
        <p>{{ item.category }}</p>
      </div>

      <div class="book-actions">
        <ion-button size="small" fill="outline" (click)="download($event)">
          Descargar
        </ion-button>
        <ion-button size="small" color="success" (click)="open($event)">
          {{ item.type === 'audio' ? 'Reproducir' : 'Leer' }}
        </ion-button>
        <ion-button *ngIf="canDelete" size="small" color="danger" (click)="delete($event)">
          Eliminar
        </ion-button>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`
     .shelf-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.shelf {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  width: 100%;
}

.book {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fffefb;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
  }
}

.cover {
  width: 100px;
  height: 140px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  img,
  .default-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .default-cover {
    background: linear-gradient(135deg, #ff9a9e, #fad0c4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    color: white;
  }
}

.book-info {
  margin-top: 10px;
  text-align: center;

  h3 {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin: 4px 0;
  }

  p {
    font-size: 12px;
    color: #666;
  }
}

.book-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  ion-button {
    font-size: 12px;
    --border-radius: 8px;
  }
}

/* Estilo tipo repisa */
.shelf::after {
  content: "";
  grid-column: 1 / -1;
  height: 6px;
  background: #d4a373;
  border-radius: 3px;
  margin-top: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

/* Responsivo */
@media (max-width: 768px) {
  .shelf {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }

  .cover {
    width: 90px;
    height: 120px;
  }

  .book-info h3 {
    font-size: 13px;
  }
}

  `]
})
export class BookCardComponent {
  @Input() item!: LibraryItem;
  private isNative = Capacitor.isNativePlatform();

  constructor(
    private userService: UserService,
    private libraryService: LibraryService
  ) {}

  get canDelete() {
    return this.userService.isFacilitator() || this.userService.getUser()?.name === this.item.uploader;
  }

  async open(ev?: Event) {
    if (ev) ev.stopPropagation();

    const fileData = await this.libraryService.getFile(this.item.filename!);
    if (!fileData) { alert('No se pudo abrir el archivo.'); return; }

    if (this.item.type === 'pdf' || this.item.type === 'image') {
      if (this.isNative) {
        // Guardar temporal y abrir con Browser
        const blob = this.base64ToBlob(fileData, this.item.mime!);
        const tempPath = `${this.item.filename}`;
        await Filesystem.writeFile({ path: tempPath, data: fileData, directory: Directory.Data });
        const uri = await Filesystem.getUri({ path: tempPath, directory: Directory.Data });
        await Browser.open({ url: uri.uri });
      } else {
        const blob = this.base64ToBlob(fileData, this.item.mime!);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } else if (this.item.type === 'audio') {
      const audioSrc = this.isNative
        ? (await Filesystem.getUri({ path: this.item.filename!, directory: Directory.Data })).uri
        : fileData;
      const audio = new Audio(audioSrc);
      audio.play();
    }
  }

  async download(ev?: Event) {
    if (ev) ev.stopPropagation();

    const fileData = await this.libraryService.getFile(this.item.filename!);
    if (!fileData) { alert('No se pudo descargar el archivo.'); return; }

    const blob = this.base64ToBlob(fileData, this.item.mime!);

    if (this.isNative) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        await Share.share({
          title: this.item.title,
          text: 'Archivo compartido',
          url: base64data,
          dialogTitle: 'Guardar o compartir archivo'
        });
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.item.filename || 'archivo';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async delete(ev?: Event) {
    if (ev) ev.stopPropagation();
    if (confirm(`¿Eliminar "${this.item.title}"?`)) {
      await this.libraryService.remove(this.item.id);
     await Swal.fire({
         title: '¡Eliminado!',
         text: 'Tu archivo se ha eliminado correctamente.',
         icon: 'success',
         confirmButtonText: 'Aceptar',
         scrollbarPadding: false,
         heightAuto: false,
           customClass:{
             popup:'custom-alert',
           },
           backdrop:true,
       });
    }
  }

  private base64ToBlob(base64: string, mime: string): Blob {
    const byteString = atob(base64.split(',')[1] || base64); // <- soporta strings sin prefijo
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mime });
  }
}
