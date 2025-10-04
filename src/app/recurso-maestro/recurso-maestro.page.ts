import { Component, OnInit,effect,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,NgModel } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonButtons,IonButton,IonIcon,IonList,IonLabel,IonItemSliding} from '@ionic/angular/standalone';
import {IonicModule,ModalController}from '@ionic/angular'
import { UploadMaestroComponent } from '../upload-maestro/upload-maestro.component';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem'
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';


@Component({
  selector: 'app-recurso-maestro',
  templateUrl: './recurso-maestro.page.html',
  styleUrls: ['./recurso-maestro.page.scss'],
  standalone: true,
  imports: [ IonicModule,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,FormsModule, IonItem,IonInput,IonButtons,IonButton,IonIcon,IonList,IonLabel,IonItemSliding]
})

export class RecursoMaestroPage implements OnInit {

  constructor(private modalCtrl:ModalController) {
    addIcons({
      personAddOutline
    })
   }
   
  maestroNombre=signal('')
  maestros=signal<{nombre:string,grados:GradoData}[]>(this.getLocalData())
  grados=['4º','5º','6º'];
  clasesPorGrado={
    '4º': ['Matemáticas', 'Lengua y Literatura', 'Ciencias Naturales'],
    '5º': ['Matemáticas', 'Lengua y Literatura', 'Ingles'],
    '6º': ['Matemáticas', 'Lengua y Literatura', 'Ciencias Sociales']
  }
    ngOnInit() {
  }
  //funcion para agregar al maestro
  async addMaestro(){
    const nombre=this.maestroNombre().trim()
    if(!nombre)return;

    if(!this.maestros().some(m=> m.nombre===nombre)){
      this.maestros.update(m=>[...m,{nombre,grados:{}}])
      this.saveLocal();
    }
    this.maestroNombre.set('')
  }

  //funcion para abrir el modal
  async openModal(nombre:string){
    const maestro=this.maestros().find(m=>m.nombre===nombre)
    const modal=await this.modalCtrl.create({
      component:UploadMaestroComponent,
      componentProps:{
        maestro,
        onSave:this.saveLocal.bind(this),
        clasesPorGrado:this.clasesPorGrado
      }
    });
    await modal.present();
  }

  //funcion para eliminar al maestro
  deleteMaestro(nombre:string){
  this.maestros.update(m=>m.filter(maestro=>maestro.nombre!==nombre))
  this.saveLocal();
  }

  //funcion para guardar la data de los maestros
  saveLocal(){
    localStorage.setItem('maestros',JSON.stringify(this.maestros()))
  }
  getLocalData(){
    return JSON.parse(localStorage.getItem('maestros')||'[]')
  }

  //Funcion para exportar los datos
  async exportData(){
    const data=JSON.stringify(this.maestros(),null,2);
    const fileName=`registros-maestros-${Date.now()}.json`;

    await Filesystem.writeFile({
      path:fileName,
       data:data,
       directory:Directory.Documents,
        encoding:Encoding.UTF8
     })
  }

  //Funcion para importar los datos
  async importData(event:any){
 const file= event.target.files[0];
   if(!file)return;
   const reader=new FileReader();
   reader.onload=()=>{
    const imported=JSON.parse(reader.result as string)
    this.maestros.set(imported);
    this.saveLocal();
   };
    reader.readAsText(file);
  }

}

type GradoData = {
  [grado: string]: {
    [clase: string]: FileData[]
  }
};
type FileData = {
  name: string;
  type: string;
  data: string; // base64 or path
};


