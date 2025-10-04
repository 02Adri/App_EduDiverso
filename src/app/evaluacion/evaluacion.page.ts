import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton,IonButtons,IonButton,IonIcon,IonItem,IonLabel,IonAvatar,IonSearchbar,IonList,IonInput,IonTextarea,IonDatetime} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline,trashOutline,addCircleOutline,funnelOutline,saveOutline } from 'ionicons/icons';
import { BitacoraEntry } from '../models/bitacora-entry.model';
import { BitacoraService } from '../service/bitacora.service';
 import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.page.html',
  styleUrls: ['./evaluacion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButtons,IonButton,IonIcon,IonItem,IonLabel,IonAvatar,IonSearchbar,IonList,IonInput,IonTextarea,IonDatetime],
})
export class EvaluacionPage implements OnInit {
   entries: BitacoraEntry[] = [];
  displayedEntries: BitacoraEntry[] = [];
  drawerOpen = false;
  editingEntry: BitacoraEntry | null = null;
  form: any = { title:'', topic:'', participants:[], notes:'', photos:[], date: new Date().toISOString() };
  participantsRaw = '';
  filterQuery = '';
  constructor(public bs:BitacoraService) {
      addIcons({informationCircleOutline,trashOutline,addCircleOutline,funnelOutline,saveOutline})
   } 

 async ngOnInit() {
    await this.loadEntries();
  }

  async loadEntries() {
    this.entries = await this.bs.getAll();
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterQuery) { this.displayedEntries = this.entries; return; }
    const q = this.filterQuery.toLowerCase();
    this.displayedEntries = this.entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.topic.toLowerCase().includes(q) ||
      e.participants.some(p => p.toLowerCase().includes(q)) ||
      e.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  //Funcion de filtrar
    openFilters() {
  // Abrir un prompt sencillo para filtrar por fecha, tema o participante
  const filterType = prompt(
    'Filtrar entradas por:\n1 - Tema\n2 - Participante\n3 - Fecha (YYYY-MM-DD)',
    '1'
  );

  if (!filterType) return;

  const type = filterType.trim();

  switch (type) {
    case '1': {
      const keyword = prompt('Ingrese el tema a buscar:')?.toLowerCase().trim();
      if (keyword) {
        this.displayedEntries = this.entries.filter(e =>
          e.topic.toLowerCase().includes(keyword)
        );
      }
      break;
    }
    case '2': {
      const participant = prompt('Ingrese el nombre del participante:')?.toLowerCase().trim();
      if (participant) {
        this.displayedEntries = this.entries.filter(e =>
          e.participants.some(p => p.toLowerCase().includes(participant))
        );
      }
      break;
    }
    case '3': {
      const dateStr = prompt('Ingrese la fecha (YYYY-MM-DD):')?.trim();
      if (dateStr) {
        const dateFilter = new Date(dateStr);
        this.displayedEntries = this.entries.filter(e => {
          const entryDate = new Date(e.date);
          return (
            entryDate.getFullYear() === dateFilter.getFullYear() &&
            entryDate.getMonth() === dateFilter.getMonth() &&
            entryDate.getDate() === dateFilter.getDate()
          );
        });
      }
      break;
    }
    default:
      alert('Opción inválida');
      break;
  }

  // Si no se ingresó nada, mostrar todas las entradas
  if (!this.displayedEntries || this.displayedEntries.length === 0) {
    this.displayedEntries = this.entries;
  }
}

  openNewEntry() {
    this.editingEntry = null;
    this.form = { title:'', topic:'', participants:[], notes:'', photos:[], date:new Date().toISOString() };
    this.participantsRaw = '';
    this.drawerOpen = true;
  }

  openView(entry: BitacoraEntry) {
    this.editingEntry = entry;
    this.form = {...entry};
    this.participantsRaw = entry.participants.join(', ');
    this.drawerOpen = true;
  }

  closeDrawer() { this.drawerOpen = false; }

  async saveEntry() {
    this.form.participants = this.participantsRaw.split(',').map(p => p.trim()).filter(p => p);
    if (this.editingEntry) {
      const updated: BitacoraEntry = { ...this.editingEntry, ...this.form };
      await this.bs.update(updated);
    } else {
      const newEntry: BitacoraEntry = { ...this.form, id: uuidv4(), createdAt: new Date().toISOString() };
      await this.bs.add(newEntry);
    }
    await this.loadEntries();
    this.closeDrawer();
  }

  async onPhotoSelected(ev: any) {
  const files: FileList = ev.target.files;
  for (let i=0; i<files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result; // esto ya es un dataURL válido
      this.form.photos.push(base64);
    };
    reader.readAsDataURL(files[i]);
  }
}


  removePhoto(idx:number) { this.form.photos.splice(idx,1); }

  async confirmDelete(entry: BitacoraEntry, event:any) {
    event.stopPropagation();
    if (confirm('Eliminar esta entrada?')) {
      await this.bs.remove(entry.id);
      await this.loadEntries();
    }
  }

  async exportAll() {
    const json = await this.bs.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bitacora_export.json';
    a.click();
  }

}
