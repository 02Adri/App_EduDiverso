import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonLabel,IonButton,IonModal,IonList,IonButtons,IonIcon } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { addIcons } from 'ionicons';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { heart } from 'ionicons/icons';
import { Score2Service } from '../service/score2.service';
@Component({
  selector: 'app-juego-sapito',
  templateUrl: './juego-sapito.page.html',
  styleUrls: ['./juego-sapito.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonInput,IonLabel,IonButton,IonModal,IonList,IonButtons,IonIcon,IonicModule]
})
export class JuegoSapitoPage implements OnInit,OnDestroy {
    //jugador
    jugador='';

    //preguntas con tres opciones cada una 
    preguntas:any[]=[
      {
        texto:'¿De qué forma demuestro respeto a las personas?',opciones:[
          {texto:'Minimizando los sentimientos de las otras personas',correcta:false},
           {texto:'Comunicando mis ideas sin agredir u ofender',correcta:true},
            {texto:'Imponiendo mis ideas',correcta:false},
        ]
      },
      {
        texto:'¿Por qué es importante la convivencia armoniosa?',opciones:[
          {texto:'Para crear un clima optimo de paz y armonía',correcta:true},
           {texto:'Porque es la manera que las personas sean sumisas',correcta:false},
            {texto:'Porque algunas personas tienen más derechos que otras',correcta:true},
        ]
      },
      {
        texto:'¿Qué valor fomenta la diversidad?',opciones:[
          {texto:'Intolerancia',correcta:false},
           {texto:'Aislamiento',correcta:false},
            {texto:'Tolerancia',correcta:true},
        ]
      },
      {
        texto:'¿Qué acciones se pueden poner en práctica para establecer relaciones más equitativas entre niños, niñas, adolescentes?',opciones:[
          {texto:'Promoviendo que solo los niños y adolescentes sean líderes de grupo',correcta:false},
           {texto:'Haciendo actividades diferenciadas por grupo',correcta:false},
            {texto:'Integrando a todos y todas en las actividades valorando sus capacidades',correcta:true},
        ]
      },
      {
        texto:'¿Por qué y para qué son necesarias las normas de comportamiento?',opciones:[
          {texto:'Porque no todas las personsas son educadas de la misma forma ',correcta:false},
           {texto:'Para convivir en respeto y armonía',correcta:true},
            {texto:'Para asegurar que las personas no opinen',correcta:false},
        ]
      },
      {
        texto:'¿Qué debes hacer si una persona me insulta y se dirige a mi de forma ofensiva?',opciones:[
          {texto:'Decirle de  forma clara y firme que merezco respeto y que una vez se calma vamos hablar nuevamente',correcta:true},
           {texto:'Responder con otro insulto',correcta:false},
            {texto:'Demostrarle miedo',correcta:false},
        ]
      },
      {
        texto:'¿Qué valor promueve la empatía?',opciones:[
          {texto:'Solidaridad',correcta:true},
           {texto:'Desconfianza',correcta:false},
            {texto:'Egoísmo',correcta:false},
        ]
      },
      {
        texto:'¿Por qué son importantes los valores en la sociedad?',opciones:[
          {texto:'Aumenta la competencia',correcta:false},
           {texto:'Promueve el aislamiento',correcta:false},
            {texto:'Fomenta la convivencia pacifíca',correcta:true},
        ]
      },
    ];

    //creamos el estado del juego
    indicePregunta=0
    preguntaActual:any=null
    juegoIniciado=false
    juegoFinalizado=false

    //Sapito /progreso visual
    posicionPorcentaje=4;//porcentaje inicial (left%)
    avancePorPregunta=0//calculado ngOnInit
    //Vidas y puntos
     vidas = 3;
     puntos = 0;
     cuentaRegresiva:number=3
   mostrandoCuenta:boolean=false;

     // temporizador por pregunta
  tiempoPorPregunta = 12; // segundos (ajusta si quieres otro)
  tiempoRestante = this.tiempoPorPregunta;
  porcentajeTiempo = 100; // para el círculo de progreso
  timerRef: any = null;

   // animaciones UI
  claseSapito = ''; // 'avanza' | 'hundirse' | 'retrocede'
  mostrarAnimPuntos = false;
  textoAnimPuntos = '+0';
  mostrarAnimVida = false;

  // ranking
  rankingAbierto = false;
  puntuacionesGuardadas: any[] = [];
  constructor(private score2:Score2Service) { 
    addIcons({heart})
  }

  ngOnInit() {
    this.guardarAvance()
    this.resetEstadoInicial()
  }
   guardarAvance(){
    this.puntuacionesGuardadas=this.score2.obtenerPuntuaciones()
    //calcular avance por pregunta(llegar al 92% al final)
    this.avancePorPregunta=Math.floor(88/this.preguntas.length)
   }
   ngOnDestroy(){
       if(this.timerRef)clearInterval(this.timerRef)
   }
  resetEstadoInicial(){
    this.indicePregunta = 0;
    this.preguntaActual = this.preguntas[this.indicePregunta];
    this.posicionPorcentaje = 4;
    this.puntos = 0;
    this.vidas = 3;
    this.claseSapito = '';
    this.porcentajeTiempo = 100;
    this.tiempoRestante = this.tiempoPorPregunta;

  }

  //Preparamos el juego pide nombre y cuenta 3..2..1
  prepararJuego(){
    if(!this.jugador?.trim()){
      Swal.fire({
        title:'Atención',
        text:'Ingresa tu nombre',
        icon:'warning',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{popup:'custom-alert'},
        backdrop:true
      });
      return;
    }
    this.juegoIniciado = false;
    this.juegoFinalizado = false;
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
  iniciarJuego() {
    this.resetEstadoInicial();
    this.juegoIniciado = true;
    this.preguntaActual = this.preguntas[this.indicePregunta];
    this.iniciarTimer();
  }

  //Funcion para iniciar el tiempo 
   iniciarTimer() {
    if (this.timerRef) clearInterval(this.timerRef);
    this.tiempoRestante = this.tiempoPorPregunta;
    this.porcentajeTiempo = 100;
    this.timerRef = setInterval(() => {
      this.tiempoRestante--;
      this.porcentajeTiempo = Math.max(0, Math.round((this.tiempoRestante / this.tiempoPorPregunta) * 100));
      if (this.tiempoRestante <= 0) {
        clearInterval(this.timerRef);
        // tiempo agotado -> como respuesta incorrecta
        this.procesarRespuesta(false, /*porTimeout*/ true);
      }
    }, 1000);
  }
  //repuesta desde la hoja opcion
  responder(opcion:any){
    if(!this.juegoIniciado || this.juegoFinalizado)return;
    clearInterval(this.timerRef)
    this.procesarRespuesta(opcion.correcta,false)
  }
   // procesa correcta/incorrecta
  procesarRespuesta(esCorrecta: boolean, porTimeout = false) {
    if (esCorrecta) {
      // puntos variables: base + bonus por rapidez + pequeño RNG
      const base = 5;
      const bonus = Math.floor(this.tiempoRestante * 2); // cada segundo vale 2 puntos aprox
      const aleatorio = Math.floor(Math.random() * 4); // 0..3
      const ganados = base + bonus + aleatorio;
      this.puntos += ganados;

      // animación avance sapito
      this.claseSapito = 'avanza';
      this.mostrarAnimPuntos = true;
      this.textoAnimPuntos = `+${ganados}`;
      setTimeout(() => this.mostrarAnimPuntos = false, 900);

      // mover sapito en porcentaje
      this.posicionPorcentaje = Math.min(96, this.posicionPorcentaje + this.avancePorPregunta);

      // pequeña pausa para animaciones
      setTimeout(() => {
        this.claseSapito = '';
        this.siguientePregunta();
      }, 700);

    } else {
      // fallo: perder vida + hundimiento
      this.vidas--;
      this.claseSapito = 'hundirse';
      this.mostrarAnimVida = true;
      setTimeout(() => this.mostrarAnimVida = false, 900);

      // retroceso visual leve (si quedan vidas)
      setTimeout(() => {
        if (this.vidas > 0) {
          this.claseSapito = 'retrocede';
          // retrocede un paso proporcional (no negativo)
          this.posicionPorcentaje = Math.max(4, this.posicionPorcentaje - Math.max(6, this.avancePorPregunta));
          setTimeout(() => this.claseSapito = '', 500);
          this.siguientePregunta();
        } else {
          // sin vidas -> finalizar con derrota
          setTimeout(() => this.finalizarJuego(false), 700);
        }
      }, 700);
    }
  }

  //Siguiente pregunta
  siguientePregunta(){
    this.indicePregunta++;
    if(this.indicePregunta>=this.preguntas.length){
      this.finalizarJuego(true)
      return
    }
    this.preguntaActual=this.preguntas[this.indicePregunta]
    this.iniciarTimer()
  }
  finalizarJuego(ganaste: boolean) {
    if (this.timerRef) clearInterval(this.timerRef);
    this.juegoFinalizado = true;
    this.juegoIniciado = false;

    if (ganaste) {
      this.lanzarConfeti();
      Swal.fire({
        title:'¡Ganaste!',
        text:`Ganaste ${this.jugador}, has obtenido una puntuacion de ${this.puntos} puntos`,
        icon:'success',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{popup:'custom-alert'},
        backdrop:true
      });
    } else {
      Swal.fire({
        title:'Juego Terminado',
        text:`El juego ha terminado haz obtenido una puntuacion de ${this.puntos}`,
        icon:'error',
        confirmButtonText:'Aceptar',
        scrollbarPadding:false,
        heightAuto:false,
        customClass:{popup:'custom-alert'},
        backdrop:true
      });
    }

    // guardar en ranking (acumula si ya existe)
    this.actualizarRanking();
  }
    //Funcion para lanzar confeti
     lanzarConfeti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
    // Insignia segun puntos acumulados
  obtenerInsignia(puntos: number) {
    if (puntos >=5000) return '🏆 Maestro';
    if (puntos >= 3000) return '🥇 Avanzado';
    if (puntos >= 2000) return '⭐ Intermedio';
    return '🌱 Principiante';
  }

  // actualizar ranking en localStorage (usa ScoreService.guardarRanking)
  actualizarRanking() {
    const maxPorPregunta = 20;
    const maxTotal = this.preguntas.length * maxPorPregunta;
    const porcentaje = Math.min(100, Math.round((this.puntos / maxTotal) * 100));

    const ranking = this.score2.obtenerPuntuaciones();
    const existente = ranking.find((r: any) => r.nombre === this.jugador);

    if (existente) {
      existente.puntos += this.puntos;
      existente.porcentaje = Math.min(100, Math.round((existente.puntos / maxTotal) * 100));
      existente.insignia = this.obtenerInsignia(existente.puntos);
      existente.fecha = new Date().toISOString();
    } else {
      ranking.push({
        nombre: this.jugador,
        puntos: this.puntos,
        porcentaje,
        insignia: this.obtenerInsignia(this.puntos),
        fecha: new Date().toISOString()
      });
    }

    // ordenar antes de guardar (mayor a menor)
    ranking.sort((a: any, b: any) => b.puntos - a.puntos);
    this.score2.guardarPuntuacion(ranking);
    this.puntuacionesGuardadas = ranking;
  }

  abrirRanking() {
    this.puntuacionesGuardadas = this.score2.obtenerPuntuaciones();
    this.puntuacionesGuardadas.sort((a: any, b: any) => b.puntos - a.puntos);
    this.rankingAbierto = true;
  }

  reiniciarJuego() {
    if (this.timerRef) clearInterval(this.timerRef);
    this.resetEstadoInicial();
    this.juegoIniciado = false;
    this.juegoFinalizado = false;
  }
  limpiarRanking() {
  this.score2.limpiarPuntuaciones();
  this.puntuacionesGuardadas = [];
}

  
}
