import { Component,OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonApp,IonMenu,IonMenuButton,IonButtons, IonButton,IonModal, IonFooter,IonList,IonItemDivider,IonLabel,IonItem,IonIcon,IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ModalController,IonicModule} from '@ionic/angular'
import { EstadisticasModalComponent } from '../estadisticas-modal/estadisticas-modal.component';
import {trigger,state,style,transition,animate} from '@angular/animations'
import Swal from 'sweetalert2';
import { addIcons } from 'ionicons';
import { analyticsOutline, documentTextOutline, downloadOutline, handLeftOutline, leafOutline,sparklesOutline, statsChartOutline,colorPaletteOutline, lockClosedOutline,megaphoneOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import {Router, NavigationEnd} from '@angular/router';

type ThemeType='ambiental' | 'genero'
type EffectType='none'|'rain' |'snow'|'stars'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonFooter, IonButton, CommonModule,FormsModule,IonHeader, IonToolbar, IonTitle, IonContent,IonApp,IonMenu,IonButtons,IonMenuButton, IonModal,IonList,IonItemDivider,IonLabel,IonIcon,IonItem,IonRouterOutlet,IonicModule],
  animations:[
    trigger('sunMoonAnimation',[
      state('day',style({cx:340,cy:60})),
      state('evening',style({cx:310,cy:100})),
      state('night',style({cx:360,cy:70})),
      transition('*<=>*',[animate('1500ms ease-in-out')])
    ]),
  ],
})

export class HomePage implements OnInit {
   
  constructor(private modalctrl:ModalController,private router:Router){
   addIcons({leafOutline,handLeftOutline,documentTextOutline,downloadOutline,analyticsOutline,sparklesOutline,statsChartOutline,colorPaletteOutline,lockClosedOutline,megaphoneOutline,shieldCheckmarkOutline});
  this.registrarIngreso()
 }
  currentTheme: ThemeType = 'ambiental'; // por defecto ambiental
  themeIcon = 'leaf-outline';
  //Efecto Ambiental
  effect:EffectType='none';
  openThemeSelector() {
    // Simple: alternar
    if (this.currentTheme === 'ambiental') {
      this.currentTheme = 'genero';
      this.themeIcon = 'heart-outline';
    } else {
      this.currentTheme = 'ambiental';
      this.themeIcon = 'leaf-outline';
    }
  }
//variables de inicializacion
scene:'day'| 'evening'| 'night'='day';
skyGradient='url(#skyDay)';
sunMoonColor='#FFD93B';

//posiciones del, Sol
sunMoonPosX=340;
sunMoonPosY=60;

showModal=false
treesPlanted=0;
emissionReduced=0;
energySaved=0;
  ngOnInit() {
   this.startPhraseRotation()
  }

  //Funcion para cambiar de escens
  updateSceneByTime(){
    const hour=new Date().getHours();
    if(hour >=6 && hour<=11){
      this.scene = 'day';
      this.skyGradient = 'url(#skyDay)';
      this.sunMoonColor = '#FFD93B';//AMARILLO SOL
      
    }else if(hour >=12 && hour<=17){
      this.scene = 'evening';
      this.skyGradient = 'url(#skyEvening)';
      this.sunMoonColor = '#FF7E5F';//NARANJA ATARDECER
    }else{
      this.scene = 'night';
      this.skyGradient = 'url(#skyNight)';
      this.sunMoonColor = '#E0E6F8';//BLANCO LUNA
    }
  }
  //Abrir el modal 
  openModal(){
    this.showModal = true;
  }
  //cerrar el modal
  closeModal(){
    this.showModal = false;
  }
  //Funcion para aumentar el numero de arboles plantados
  animateStats(){
    const targetTrees=15000;
    const targetEmissions=1250;
    const targetEnergy=350;

    let currentTrees=0;
    let currentEmissions=0;
    let currentEnergy=0;

    const interval=setInterval(()=>{
      if(currentTrees <targetTrees){
        currentTrees += 100;
        this.treesPlanted = currentTrees;
      }
      if(currentEmissions <targetEmissions){
        currentEmissions += 10;
        this.emissionReduced = currentEmissions;
      }
      if(currentEnergy <targetEnergy){
        currentEnergy += 5;
        this.energySaved = currentEnergy;
      }
      if(currentTrees>=targetTrees && currentEmissions>=targetEmissions && currentEnergy>=targetEnergy){
        clearInterval(interval);

      }
    },80)
  }

  //Inicializar las escenas y mensajes
  openGenderInfo(){
    Swal.fire({
      title:'Enlaces locales de ayuda',
      text:'Si necesitas ayuda, habla con una persona de confianza. Escuela/Orientación/Línea de atención Local',
      icon:'success',
      confirmButtonText:'Entendido',
      scrollbarPadding:false,
      heightAuto:false,
      customClass:{
        popup:'custom-alert',
      },
      backdrop:true
    })
  }
  
  //funcion para registrar el ingreso a la aplicacion
  registrarIngreso(){

    const now=new Date().toLocaleString();
    let registros=JSON.parse(localStorage.getItem('ingresos')||'[]')
    
    //Agregar nuevos registros
    registros.push({hora:now})

    localStorage.setItem('ingresos',JSON.stringify(registros));

  }

  //Funcion para ver estadisticas
  async verEstadisticas(){
    const registros=JSON.parse(localStorage.getItem('ingresos' )|| '[]')

    //calcular estadisticas
    const totalIngresos=registros.length;

    const hoy=new Date().toLocaleDateString();
    const ingresosHoy=registros.filter((r:any)=>
        r.hora.includes(hoy)
    ).length;

    const porcentaje=totalIngresos>0
    ?((ingresosHoy / totalIngresos)*100).toFixed(1)
    :0;
      const ultimaFecha = registros.length
      ? registros[registros.length - 1].fecha + ' ' + registros[registros.length - 1].hora
      : 'Sin registros';

    const modal=await this.modalctrl.create({
      component:EstadisticasModalComponent,
      componentProps:{
        totalIngresos,
        ingresosHoy,
        porcentaje,
        ultimaFecha,
        registros,
      }
    });
    await modal.present()
  }
   

  //Funcion del toogle 
  footerOpen=false;
  currentPhrase="La igualdad nos incluye a todos  💜 "

  private phrases: string[] = [
  "Secreto: no guardes silencio, busca ayuda.",
  "Incomodidad: tienes derecho a decir que NO.",
  "Personas de confianza: siempre cuenta lo que sientes.",
  "Romper el silencio es un acto de valentía.",
  "No: aprendamos a decirlo sin miedo.",
  "Protección: necesitamos ser escuchados y respetados.",
  "No es mi culpa: nunca culpes a la víctima.",
  "Amenazas: busca apoyo, no estás solo/a.",
  "Juegos indebidos: nadie debe tocar tus partes íntimas.",
  "¡Alerta!: cambios de conducta pueden ser señales.",
  "Abrazos: tienes derecho a decidir cuándo y de quién recibirlos."
];
  toggleFooterPanel(){
    this.footerOpen=!this.footerOpen
  }

  //Funcion de rotacion de los parrafos
  startPhraseRotation(){
    let index=0;
    setInterval(()=>{
      index=(index + 1) % this.phrases.length;
      this.currentPhrase=this.phrases[index]
    },5000)//cambia cada 5 segundos
  }

  //funcion para el cambio de efecto ambiental
  toggleEffectMenu(){
    const options:EffectType[]=['none','rain','snow','stars']
    const currentIndex=options.indexOf(this.effect);
    const nextIndex=(currentIndex+1)% options.length;
    this.effect=options[nextIndex]
  }
}
