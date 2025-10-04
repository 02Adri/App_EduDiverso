import { Component } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../service/library.service';
import { LibraryItem } from '../models/library.models';
import { UploadModalComponent } from '../components/upload-modal.component';
import { RoleSelectorComponent } from '../components/role-selector.component';
import { BookCardComponent } from '../components/book-card.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RoleSelectorComponent,
    BookCardComponent
  ],
  template: `
   <ion-header>
  <ion-toolbar color="primary" class="header-toolbar">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home" text="Volver"></ion-back-button>
    </ion-buttons>
    <ion-title class="title-header">📚 Biblioteca Virtual</ion-title>
    <ion-buttons slot="end">
      <ion-button fill="solid" color="light" (click)="openUpload()">+ Subir</ion-button>
    </ion-buttons>
  </ion-toolbar>

  <!-- Segmento de categorías -->
  <ion-toolbar class="categories-toolbar">
    <ion-segment [(ngModel)]="selectedCategory" scrollable>
      <ion-segment-button value="Todos">
        <ion-icon name="grid-outline"></ion-icon>
        <ion-label>Todos</ion-label>
      </ion-segment-button>
      <ion-segment-button *ngFor="let c of categories" [value]="c">
        <ion-icon [name]="getIcon(c)"></ion-icon>
        <ion-label>{{c}}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>

  <!-- Buscador -->
  <ion-toolbar>
    <ion-searchbar
      [(ngModel)]="search"
      placeholder="🔍 Buscar libros o audiolibros..."
      showCancelButton="focus"
      debounce="300"
      animated>
    </ion-searchbar>
  </ion-toolbar>

  <!-- Selector de rol -->
  <ion-toolbar>
    <app-role-selector></app-role-selector>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding" fullscreen>
  <div class="shelf animate__animated animate__fadeIn">
    <div class="cards">
      <app-book-card *ngFor="let it of filterItems()" [item]="it"></app-book-card>
    </div>

    <div *ngIf="filterItems().length === 0" class="empty">
      <h3>📭 Sin resultados</h3>
      <p>Invita a tus facilitadores a subir libros o audiolibros ✨</p>
    </div>
  </div>
</ion-content>

  `,
  styles: [`
    // Header con gradiente
.header-toolbar {
  --background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
}

.title-header {
  font-weight: 700;
  font-size: 1.2rem;
}

// Segmento de categorías
.categories-toolbar {
  ion-segment {
    --background: transparent;
    padding: 6px 0;
  }
  ion-segment-button {
    --color: #444;
    --color-checked: #fff;
    --indicator-color: #2575fc;
    border-radius: 12px;
    margin: 0 4px;
    padding: 6px 10px;
    transition: all 0.3s ease;

    ion-icon {
      margin-right: 6px;
      font-size: 18px;
    }

    &.segment-button-checked {
      background: #2575fc;
      color: #fff;
      transform: scale(1.05);
    }
  }
}

// Grid responsive
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 12px;
}

// Animación al cargar tarjetas
app-book-card {
  animation: fadeInUp 0.5s ease;
}

// Estado vacío
.empty {
  text-align: center;
  padding: 40px;
  color: #777;
}

// Animación keyframes
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

// Responsivo
@media (min-width: 768px) {
  .title-header {
    font-size: 1.5rem;
  }
  .cards {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

    
  `]
})
export class LibraryPage {
  items: LibraryItem[] = [];
  categories = ['Cuentos','Ciencia','Matemáticas','Arte','Audiolibros','Destacados'];
  selectedCategory = 'Todos';
  search = '';

  constructor(
    private svc: LibraryService,
    private modalCtrl: ModalController,
    private alert: AlertController
  ) {
    this.refresh();
  }

  refresh() {
    this.items = this.svc.getAll();
  }

  async openUpload() {
    const m = await this.modalCtrl.create({ component: UploadModalComponent });
    m.onDidDismiss().then(() => this.refresh());
    await m.present();
  }

  filterItems(): LibraryItem[] {
    let list = this.items;
    if (this.selectedCategory && this.selectedCategory !== 'Todos') {
      if (this.selectedCategory === 'Destacados') list = list.filter(i => i.type === 'pdf' || i.category === 'Cuentos');
      else list = list.filter(i => i.category === this.selectedCategory);
    }
    if (this.search?.trim()) {
      const s = this.search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(s) || (i.description||'').toLowerCase().includes(s));
    }
    return list;
  }

  //Funcion para mostrar iconos
  getIcon(cat: string): string {
  switch (cat) {
    case 'Cuentos': return 'book-outline';
    case 'Ciencia': return 'flask-outline';
    case 'Matemáticas': return 'calculator-outline';
    case 'Arte': return 'color-palette-outline';
    case 'Audiolibros': return 'headset-outline';
    case 'Destacados': return 'star-outline';
    default: return 'library-outline';
  }
}

}
