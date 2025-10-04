import { Component, OnInit,Input } from '@angular/core';
import{IonHeader,IonToolbar,IonButtons,IonButton,IonIcon,IonContent,IonItem,IonLabel,IonSelect,IonSelectOption,IonList} from '@ionic/angular/standalone'
import{CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {addIcons} from 'ionicons'
import { closeOutline, downloadOutline, eyeOutline, trashBinOutline } from 'ionicons/icons';
import { IonicModule,ModalController } from '@ionic/angular';
import { Filesystem,Directory,Encoding} from '@capacitor/filesystem';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-upload-maestro',
  templateUrl: './upload-maestro.component.html',
  styleUrls: ['./upload-maestro.component.scss'],
  standalone: true,
  imports: [ CommonModule,FormsModule,IonicModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonList
  ]
   
})
export class UploadMaestroComponent  implements OnInit {
  // Input property to receive the selected file type
  @Input() maestro!:any;
  @Input()  onSave!: () => void;
 @Input() clasesPorGrado!: { [grado: string]: string[] };

  //variables para seleccionar el grado y la clase
   selectedGrado:string=''
   selectedClase:string=''
   vistsPrevia:any[]=[]
   Object=Object;
  constructor(private modalCtrl: ModalController) {
    addIcons({closeOutline,eyeOutline,trashBinOutline,downloadOutline})
   }

  ngOnInit() {}

  //Metodo para obtener las clases
  get clases(){
    return this.selectedGrado ?this.maestro.grados[this.selectedGrado]?.[this.selectedClase] || [] : [];
  }
  
  //Funcion para Seleccionar Archivos
  seleccionarArchivos(event:any){
    const files=event.target.files[0]
    if(!files||!this.selectedGrado||!this.selectedClase) return

    const reader= new FileReader()
    reader.onload=()=>{
      const base64=reader.result as string;
      const nuevoArchivo={name:files.name, type:files.type,data:base64}

      // Verificar si el grado y la clase existen
      this.maestro.grados[this.selectedGrado]??={}
      this.maestro.grados[this.selectedGrado][this.selectedClase]??=[]
      this.maestro.grados[this.selectedGrado][this.selectedClase].push(nuevoArchivo)
      this.onSave()
    };
    reader.readAsDataURL(files)
  }

  //Funcion para eliminar un archivo
  eliminarArchivo(index:number){
     this.maestro.grados[this.selectedGrado][this.selectedClase].splice(index,1);
     this.onSave();
  }
  //Funcion para cerrar el modal
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  //Funcion para ver la vista previa del archivo
  openPreview(fileUrl:string):void{
    window.open(fileUrl, '_blank');
  }

  //funcion para descargar archivo localmente
  async descargarArchivo(fileBase64:string,fileName:string ,mimeType:string){
    try {
      await Filesystem.writeFile({
        path:fileName,
        data:fileBase64,
        directory:Directory.Documents,
        recursive:true,
      });
      Swal.fire({
        title:'Archivo Descargado',
        text:'Archivo descargado correctamente',
        icon:'success',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{
            popup:'custom-alert'
        },
        backdrop: true,
      })
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      Swal.fire({
        title:'Error al descargar',
        text:'No se pudo descargar el archivo',
        icon:'error',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{
            popup:'custom-alert'
        },
        backdrop: true,
      })
    }
  }

}


