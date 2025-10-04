import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonLabel,IonButton,IonModal,IonList,IonButtons, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { ScoreService } from '../service/score.service';
import Swal from 'sweetalert2';
import confetti  from 'canvas-confetti';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
@Component({
  selector: 'app-juego-estereotipos',
  templateUrl: './juego-estereotipos.page.html',
  styleUrls: ['./juego-estereotipos.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonInput,IonLabel,IonButton,IonModal,IonList,IonButtons]
})
export class JuegoEstereotiposPage implements OnInit {
   jugador:string=''
   //Agregamos las preguntas
   preguntas=[
    {texto:'Las niñas tienen igual capacidad que los niños para aprender matemáticas.',respuesta:true},
    {texto:'Los niños son mejores líderes que las niñas.',respuesta:false},
    {texto:'Los niños son más hábiles con la tecnología que las niñas.',respuesta:false},
    {texto:'Las niñas pueden destacar en el deporte.',respuesta:true},
     {texto:'Tanto las niñas como los niños pueden expresar sus emociones.',respuesta:true},
     {texto:'Los niños trabajan mejor en equipo que las niñas.',respuesta:false},
     {texto:'Niñas y niños tienen los mismos derechos.',respuesta:true},

   ];
   preguntaActual:number=0;
   puntuacion:number=0;
   vidas:number=3;
   tiempoRestante:number=15;
   cuentaRegresiva:number=3
   mostrandoCuenta:boolean=false;
   juegoIniciado:boolean=false;
    juegoFinalizado:boolean=false;
    mensajeFinal:string='';

    tiempoInterval:any;
    rankingAbierto:boolean=false;
    puntuacionesGuardadas:any[]=[];

    //Mostrar Animaciones 
    mostrarAnimacionPuntos=false;
    mostrarAnimacionVida=false;

  constructor(private scoreService:ScoreService) {
      addIcons({heart})
   }
   ngOnInit() {
    this.puntuacionesGuardadas=this.scoreService.obtenerPuntuaciones()
  }

   //Funcion para prearar el juego
   prepararJuego(){
    if(!this.jugador.trim()){
   
      Swal.fire({
        title:'Atención',
        text:'Por favor, ingresa tu nombre para comenzar el juego.',
        icon:'warning',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{
          popup:'custom-alert',
        },
        backdrop:true
      })
      return;
    }
    this.mostrandoCuenta=true
    this.cuentaRegresiva=3
    let countdown=setInterval(()=>{
      this.cuentaRegresiva--;
      if(this.cuentaRegresiva===0){
        clearInterval(countdown);
        this.mostrandoCuenta=false;
        this.iniciarJuego();
      }
    },1000)
   }

   //Funcion para iniciar el juego
    iniciarJuego(){
      this.juegoIniciado=true;
      this.juegoFinalizado=false;
      this.puntuacion=0;
      this.preguntaActual=0;
      this.vidas=3;
      this.iniciarTimer()
    }
    //Funcion para iniciar el temporizador
    iniciarTimer(){
      this.tiempoRestante=10;
      this.tiempoInterval=setInterval(()=>{
        this.tiempoRestante--;
        if(this.tiempoRestante<=0){
          clearInterval(this.tiempoInterval)
          this.perderVida();
          this.siguientePregunta();
        }
    },1000)
    }

     //Funcion para Responder las preguntasç
     responder(respuesta:boolean){
      clearInterval(this.tiempoInterval)
      const correcta=this.preguntas[this.preguntaActual].respuesta;
      if(respuesta===correcta){
        const puntosGanados=5+ Math.floor(Math.random()*this.tiempoRestante*2)
        this.puntuacion+=puntosGanados;
        this.animarPuntos();
        Swal.fire({
           title:'¡Correcto!',
           icon:'success',
           text:`Bien hecho, tienes mucho talento 👍, ganaste ${puntosGanados}puntos...`,
          scrollbarPadding:false,
        heightAuto:false,
        customClass:{
          popup:'custom-alert',
        },
        backdrop:true
        })
      }else{
        this.perderVida();
        this.animarVida();
         Swal.fire({
           title:'¡Correcto!',
           text:'Incorrecto, Perdiste una vida 💔',
           icon:'error',
          scrollbarPadding:false,
        heightAuto:false,
        customClass:{
          popup:'custom-alert',
        },
        backdrop:true
        })

      }
      this.siguientePregunta();
     }
     //Funcion para perderVida
     perderVida(){
      this.vidas--;
      if(this.vidas<=0){
        this.finalizarJuego(false);
      }
     }
     //Funcion para siguiente pregunta
     siguientePregunta(){
      this.preguntaActual++;
      if(this.preguntaActual>=this.preguntas.length){
        this.finalizarJuego(true);
      }else{
        this.iniciarTimer();
      }
     }

     //Funcion para finalizar el juego
     finalizarJuego(ganaste:boolean){
      clearInterval(this.tiempoInterval)
      this.juegoFinalizado=true;
      this.juegoIniciado=false;
      if(ganaste){
        this.mensajeFinal=`¡Felicidades ${this.jugador}, ganaste el juego con una puntuación de ${this.puntuacion}! 🎉`;
        this.lanzarConfeti()
      }else{
        this.mensajeFinal=`Lo siento ${this.jugador}, perdiste el juego. Tu puntuación final es ${this.puntuacion}. ¡Inténtalo de nuevo! 😞`;
      }
       this.guardarPuntuacion()
     }

     //Funcion para guardar puntuacion
      guardarPuntuacion(){
     
     const totalPreguntas=this.preguntas.length
     const porcentaje=Math.round((this.puntuacion/(totalPreguntas*20))*100)
     
      let jugadorExistente= this.puntuacionesGuardadas.find(p=>p.nombre===this.jugador)
     
      
      if(jugadorExistente){
        jugadorExistente.puntos +=this.puntuacion
        jugadorExistente.porcentaje=Math.min(100,Math.round((jugadorExistente.puntos/(totalPreguntas*20)))*100)
         jugadorExistente.insignia=this.obtenerInsignia(jugadorExistente.puntos)
      
      }else{
          this.puntuacionesGuardadas.push({
             nombre:this.jugador,
             puntos:this.puntuacion,
             porcentaje:porcentaje,
             insignia:this.obtenerInsignia(this.puntuacion)         })
      }
      this.scoreService.guardarPuntuacion(this.puntuacionesGuardadas)
        Swal.fire({
          title:'Puntuación Guardada',
          text:'Tu puntuación ha sido guardada exitosamente.',
          icon:'success',
          confirmButtonText:'Aceptar',
          scrollbarPadding:false,
          heightAuto:false,
          customClass:{
            popup:'custom-alert',
          },
          backdrop:true
        })
      
      /*  this.scoreService.guardarPuntuacion(this.jugador,this.puntuacion);
        this.puntuacionesGuardadas=this.scoreService.obtenerPuntuaciones();
        Swal.fire({
          title:'Puntuación Guardada',
          text:'Tu puntuación ha sido guardada exitosamente.',
          icon:'success',
          confirmButtonText:'Aceptar',
          scrollbarPadding:false,
          heightAuto:false,
          customClass:{
            popup:'custom-alert',
          },
          backdrop:true
        })*/

     }
        //Funcion de obtenerbinsignias
        obtenerInsignia(puntos: number) {
    if (puntos <500) return '🌱 Principiante';
    if (puntos <1000) return '⭐ Avanzado';
    return '🏆 Maestro';
  }

      //Funcion para reiniciar juego
        reiniciarJuego(){
          this.juegoFinalizado=false;
          this.juegoIniciado=false;
          this.vidas=3;
          this.puntuacion=0;
          this.preguntaActual=0;
        }

        //Funcion para mostrar ranking
        mostrarRanking(){
           this.puntuacionesGuardadas=this.scoreService.obtenerPuntuaciones();
             // Ordenar por puntos (de mayor a menor)
  this.puntuacionesGuardadas.sort((a, b) => b.puntos - a.puntos);
           
           this.rankingAbierto=true;
        }

        //Funcion para las animaciones
        animarPuntos(){
          this.mostrarAnimacionPuntos=true;
          setTimeout(()=>this.mostrarAnimacionPuntos=false,1000)
        }

        animarVida() {
    this.mostrarAnimacionVida = true;
    setTimeout(() => this.mostrarAnimacionVida = false, 1000);
  }
  //Funcion para lanzar confeti
  lanzarConfeti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
        
}
