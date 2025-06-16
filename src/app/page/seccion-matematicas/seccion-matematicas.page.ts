import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton,IonInput,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {chevronBackOutline} from 'ionicons/icons';
import { LocalStorageService } from 'src/app/service/localStorage';
import Swal from 'sweetalert2';

//creamos nuestras interfaces para los componentes del minijuego
interface Ejercicio {
  tipo:'Completar' | 'Visual';
  imgA?:string;
  imgB?:string;
  a?:number;
  b?:number;
  resultado:number;
  enunciado:string;
  respuestaCorrecta:number;
}
@Component({
  selector: 'app-seccion-matematicas',
  templateUrl: './seccion-matematicas.page.html',
  styleUrls: ['./seccion-matematicas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButtons,IonInput,IonButton]
})
export class SeccionMatematicasPage implements OnInit {
   //variables para almacenar los ejercicios
   nivel:number=1;
   ejercicios:Ejercicio[]=[]
   ejerciciosActual:number=0;
   repuesta:string='';
    //variable para almacenar el resultado del ejercicio
    correctas:number=0;
    nombreEstudiante:string='';
    jugadores:string[]=[]
  constructor(private storage:LocalStorageService) {
    //Agregar iconos personalizados
    addIcons({chevronBackOutline});
    
    //generamos los ejercicios
    this.generarEjercicios();
  
  }
  async ngOnInit() {
  await this.mostrarPromptJugador();
}

// Mostrar el prompt con la lista actualizada de jugadores
async mostrarPromptJugador() {
  await this.storage.cargarJugadores();
  const data = await this.storage.obtenerJugadores();
  this.jugadores = Object.keys(data);

  const { value: nombre } = await Swal.fire({
    title: 'Selecciona o escribe tu nombre',
    html: `
      <select id="listaJugadores" class="swal2-input">
        <option disabled selected value="">--Jugadores registrados--</option>
        ${this.jugadores.map(j => `<option value="${j}">${j}</option>`).join('')}
      </select>
      <input id="nuevoNombre" class="swal2-input" placeholder="O escribe tu nombre" />

      <div id="botonExportarContainer" style="margin-top:10px;"></div>

      <button id="importarBtn" style="margin-top:10px;" class="swal2-confirm swal2-styled swal2-default-outline">
        Importar jugador
      </button>
      <input type="file" id="archivoJugador" accept=".json" style="display:none;" />
    `,
    didOpen: () => {
      const exportarContainer = document.getElementById('botonExportarContainer');
      const selectElem = document.getElementById('listaJugadores') as HTMLSelectElement;
      const inputElem = document.getElementById('nuevoNombre') as HTMLInputElement;

      const actualizarBotonExportar = () => {
        const select = selectElem.value;
        const input = inputElem.value.trim();

        const nombreElegido = select || input;

        // Si el usuario escribe algo nuevo
        if (input.length > 0) {
          exportarContainer!.innerHTML = ''; // Oculta el botón
          selectElem.value = ""; // Reinicia el select a "--Jugadores registrados--"
          return;
        }

        // Si hay un nombre seleccionado desde el combo y es válido
        if (select && this.jugadores.includes(select)) {
          exportarContainer!.innerHTML = `
            <button style="margin:2px;" id="btnExportar" class="swal2-confirm swal2-styled">
              Exportar ${select}
            </button>
          `;

          const btnExportar = document.getElementById('btnExportar');
          btnExportar?.addEventListener('click', async () => {
            await this.storage.exportarUno(select);
          });
        } else {
          exportarContainer!.innerHTML = ''; // Oculta si no hay selección válida
        }
      };

      // Detectar cambios
      selectElem.addEventListener('change', actualizarBotonExportar);
      inputElem.addEventListener('input', actualizarBotonExportar);

      // Botón de importar
      const importarBtn = document.getElementById('importarBtn');
      const archivoInput = document.getElementById('archivoJugador') as HTMLInputElement;

      if (importarBtn && archivoInput) {
        importarBtn.addEventListener('click', () => archivoInput.click());

        archivoInput.addEventListener('change', async () => {
          if (archivoInput.files && archivoInput.files.length > 0) {
            const file = archivoInput.files[0];
            const reader = new FileReader();

            reader.onload = async (e: any) => {
              const contenido = e.target.result;
              await this.storage.importarJugadoresDesdeArchivo(contenido);
              await this.mostrarPromptJugador(); // Recargar prompt
            };

            reader.readAsText(file);
          }
        });
      }
    },
    preConfirm: () => {
      const select = (document.getElementById('listaJugadores') as HTMLSelectElement).value;
      const input = (document.getElementById('nuevoNombre') as HTMLInputElement).value.trim();
      const nombreElegido= select || input;
      
      //Si el input tiene valor y ya existe en la lista
      if(input && this.jugadores.includes(input)){
        Swal.showValidationMessage(`El nombre "${input}" ya está en uso. Por favor, elige otro.`);
        return false;
      }
       return nombreElegido;
    },
    confirmButtonText: 'Continuar',
    showCancelButton: true,
    cancelButtonText:'No, gracias',
    allowOutsideClick: false,
    allowEscapeKey: false,
    scrollbarPadding: false,
    heightAuto: false,
    customClass: {
      popup: 'custom-alert'
    },
    backdrop: true
  });

  if (nombre) {
    this.nombreEstudiante = nombre;
    this.nivel = await this.storage.obtenerNivel(nombre);
    await this.storage.guardarJugador(nombre, this.nivel);
    this.jugadores = Object.keys(await this.storage.obtenerJugadores());
    this.generarEjercicios();
  }
}



    //Funcion para generar ejercicios
    generarEjercicios(){
      this.ejercicios=[];
      for(let i=0; i<15; i++){
        const tipoEjercicio=this.nivel <=3
        ?(Math.random()<0.7 ? 'Visual':'Completar')//mezcla visual y completar
        :(Math.random()<0.3 ? 'Visual':'Completar');//mezcla visual y completar
          if(tipoEjercicio ==='Visual')
          {
            const a=Math.floor(Math.random()*3)+1;
            const b=Math.floor(Math.random()*3)+1;
            const resultado=a+b;
            this.ejercicios.push({
              tipo:'Visual',
              imgA:`assets/figuras/${this.getRandomFiguras()}.png`,
              imgB:`assets/figuras/${this.getRandomFiguras()}.png`,
              a,b,
              resultado,
              enunciado:`¿Cuántos hay en total?`,
              respuestaCorrecta:resultado
            })
          }else{
            const resultado=Math.floor(Math.random()*10+5);
            const a=Math.floor(Math.random()*resultado);
            const b=resultado-a;
            this.ejercicios.push({
              tipo:'Completar',
              a,
              resultado,
              enunciado:`${a} + ___ = ${resultado}`,
              respuestaCorrecta:b
            })
            
          }
          
      }
    }

    //Funcion random de figuras
    getRandomFiguras():string{
      const figuras=['Estrella','gato','nube','pelota'];
       return figuras[Math.floor(Math.random()*figuras.length)]
    }
    //Funcion de verificar la respuesta
    verificar(){
      const res=parseInt(this.repuesta)
      if(res=== this.ejercicios[this.ejerciciosActual].respuestaCorrecta){
        this.correctas++;
      }
      this.ejerciciosActual++;
      this.repuesta='';
      if(this.ejerciciosActual>=15){
         //En este parte del codigo al finalizar las 15 preguntas termina el nivel
        this.terminarNivel()
      }
    }

    //Funcion para terminar nivel
   async terminarNivel(){
      if(this.correctas>=10){
        this.nivel++
       await this.storage.guardarJugador(this.nombreEstudiante, this.nivel)
        Swal.fire({
          title:'¡Exitos en el Nivel!',
          text:`Has superado con éxitos este nivel, el siguiente te espera ${this.nombreEstudiante}`,
          icon:'success',
          confirmButtonText:'OK',
          scrollbarPadding:false,
          heightAuto:false,
          customClass:{
            popup:'custom-alert'
          },
          backdrop:true
        })
      }else{
        Swal.fire({
          title:'¡No has superado el nivel!',
          text:`Sigue intentando ${this.nombreEstudiante}`,
          icon:'error',
          confirmButtonText:'Ok',
          scrollbarPadding:false,
          heightAuto:false,
          customClass:{
            popup:'custom-alert'
          },
          backdrop:true
        })
      }
      this.correctas=0
      this.ejerciciosActual=0
      this.generarEjercicios();

    }
  

}
