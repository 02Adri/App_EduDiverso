import { Component,Renderer2,ElementRef,ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {TextToSpeech} from '@capacitor-community/text-to-speech'
import {Capacitor} from '@capacitor/core'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule,FormsModule,IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  //variables para mostrar el personaje
  mostrar:boolean=false;
  @ViewChild('brazoIzq',{static:false}) brazoIzq!:ElementRef<SVGRectElement>;
  @ViewChild('brazoDer',{static:false}) brazoDer!:ElementRef<SVGRectElement>;

  //mensaje que dira el personaje al darle click
  mensaje:string=`EduDiverso es una aplicación educativa interactiva y divertida diseñada para estudiantes de educación primaria, 
  que promueve el aprendizaje inclusivo, creativo y personalizado. A través de juegos, cuentos animados, desafíos y misiones, 
  los niños exploran el mundo de las ciencias, matemáticas, lectura, valores y arte de una forma entretenida, adaptada a su ritmo y estilo de aprendizaje.`;
  
  constructor(private renderer:Renderer2) {}

  //Funcion para mostrar el  personaje
  async mostrarPersonaje() {
    this.mostrar=true;
    //iniciar animacion del personaje
    this.animarBrazos();
       //iniciar hablar Texto
      await this.hablarTexto(this.mensaje)
      //ocultar personaje
      this.mostrar=false;
  }
  //Funcion para hablar texto
  async hablarTexto(texto:string){
    const plataforma= Capacitor.getPlatform();

    if(plataforma === 'web'){
       //web: se utiliza API SpeechSynthesis
       return new Promise<void>((resolve)=>{
         const voz = new SpeechSynthesisUtterance(texto);
          voz.lang = 'es-ES';
          voz.pitch = 1.2; // Ajusta el tono de voz
          voz.rate = 1; // Ajusta la velocidad de la voz

          voz.onend=()=>{
            this.pararAnimacionBrazos();
            resolve();
          };
          speechSynthesis.speak(voz)
       });
    }else{
      //plataforma para android utilizando Capacitor TTS
      try {
        await TextToSpeech.speak({
          text: texto,
          lang: 'es-ES',
          rate: 1.0,
          pitch: 1.2,
          volume:1.0,
          category: 'ambient',
        })
      } catch (error) {
        console.error('Error al hablar el texto:', error);
      }
      this.pararAnimacionBrazos();
    }
  }

  //Funcion para animar los brazos del personaje
  brazoInterval:any
  animarBrazos() {
    const brazoIzq= document.getElementById('brazoIzq')!;
    const brazoDer= document.getElementById('brazoDer')!;

    //Angulo de los brazoa
    let angle=0;
    let direction=1;

    this.brazoInterval= setInterval(()=>{
      //Oscilar entre 15 y -15 grados
      angle += direction * 2; // Incrementar o decrementar el ángulo
      if(angle >15) direction=-1;
      if(angle < -15) direction=1;


      //Rotacion de cada brazo
      brazoIzq.style.transform = `rotate(${angle}deg)`;
      brazoIzq.style.transformOrigin = 'right center';
      //brazo derecho
      brazoDer.style.transform = `rotate(${-angle}deg)`;
      brazoDer.style.transformOrigin = 'left center';
    },100)
  }
   //Funcion parar animacion de brazos
   pararAnimacionBrazos() {
      clearInterval(this.brazoInterval)
      const brazoIzq=document.getElementById('brazoIzq')!;
      const brazoDer=document.getElementById('brazoDer')!;
      //Restablecer transformaciones
      brazoIzq.style.transform = 'rotate(0deg)';
      brazoDer.style.transform ='rotate(0deg)'
   }

}
