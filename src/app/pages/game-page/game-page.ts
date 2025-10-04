import { Component, AfterViewInit, OnDestroy, HostListener, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RankingService } from '../../service/ranking.service';
import { CountdownOverlayComponent } from '../../components/countdown-overlay/countdown-overlay.component';
import { GameOverModalComponent } from '../../components/game-over-modal/game-over-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonFab,IonFabButton,IonIcon} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { play } from 'ionicons/icons';
type SpawnItem = {
  id: string;
  kind: string;
  x: number;
  y: number;
  vy: number;
  speed: number;
};

type Container = {
  kind: string;
  x: number;
  width: number;
  element?: HTMLElement;
};

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.html',
  styleUrls: ['./game-page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CountdownOverlayComponent,IonHeader,IonToolbar,IonTitle,IonContent,IonFab,IonFabButton,IonIcon]
})
export class GamePage implements AfterViewInit, OnDestroy {
  jugador = '';
  score = 0;
  timeLeft = 60;
  level = 1;
  running = false;

  activeItems: SpawnItem[] = [];
  containers: Container[] = [];
  containerSpeed = 4; // velocidad de movimiento lateral
  keysPressed: Set<string> = new Set();

  spawnIntervalId: any;
  gameLoopId: any;
  gravity = 300;

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent){ this.keysPressed.add(e.key); }
  @HostListener('window:keyup', ['$event']) onKeyUp(e: KeyboardEvent){ this.keysPressed.delete(e.key); }
  @HostListener('window:resize') onResize(){ this.recalculateContainers(); }

  constructor(private ranking: RankingService, private modalCtrl: ModalController, private renderer: Renderer2) {
    addIcons({
      play
  })
  }

  ngAfterViewInit(){ this.setupContainers(); }
  ngOnDestroy(){ this.stopGame(); }

  iniciarJuego(){
    this.resetGame();
    this.running = true;
    this.spawnIntervalId = setInterval(()=> this.spawnItem(), 1200);
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));

    const timer = setInterval(()=>{
      if(!this.running) { clearInterval(timer); return; }
      this.timeLeft--;
      if(this.timeLeft<=0) this.endGame();
    }, 1000);
  }

  resetGame(){
    this.score = 0; this.timeLeft = 60; this.level = 1;
    this.activeItems = []; this.containers = [];
    this.stopGame();
    this.setupContainers();
  }

  stopGame(){
    this.running = false;
    if(this.spawnIntervalId) clearInterval(this.spawnIntervalId);
    if(this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
  }

  setupContainers(){
    this.containers = [];
    const kinds = ['plastica','papel','organico','vidrio'];
    for(let i=0; i<1; i++){ // al inicio solo 1 contenedor
      this.containers.push({ kind: kinds[i], x: 20+i*100, width: 70 });
    }
    setTimeout(()=> this.recalculateContainers(), 300);
  }

  recalculateContainers(){
    const elems = Array.from(document.querySelectorAll('.containers .container')) as HTMLElement[];
    elems.forEach((el,i)=>{
      if(this.containers[i]) this.containers[i].element = el;
    });
  }

  spawnItem(){
    const kinds = ['container-plastica','container-papel','container-organico','container-vidrio'];
    const kind = kinds[Math.floor(Math.random()*this.level)];
    this.activeItems.push({
      id: this.uuid(),
      kind,
      x: Math.random()*80+10,
      y: -50,
      vy: this.gravity + Math.random()*100,
      speed: 0
    });
  }

  gameLoop(){
    if(!this.running) return;

    // mover contenedores con teclado
    this.containers.forEach(c=>{
      if(this.keysPressed.has('ArrowLeft')) c.x -= this.containerSpeed;
      if(this.keysPressed.has('ArrowRight')) c.x += this.containerSpeed;
      if(c.element) c.element.style.left = c.x+'px';
    });

    // mover residuos
    this.activeItems.forEach(item=>{
      item.y += item.vy/60; // aproximación
    });

    // colisiones
    this.checkCollisions();

    // eliminar fuera de pantalla
    this.activeItems = this.activeItems.filter(i=> i.y<window.innerHeight+50);

    // niveles
    if(this.score >=50 && this.level==1) this.addContainer(2);
    if(this.score >=100 && this.level==2) this.addContainer(3);
    if(this.score >=200 && this.level==3) this.addContainer(4);

    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  addContainer(level:number){
    this.level = level;
    const kinds = ['plastica','papel','organico','vidrio'];
    this.containers = kinds.slice(0,level).map((k,i)=> ({ kind:k, x: 50+i*100, width:70 }) );
    setTimeout(()=> this.recalculateContainers(), 300);
  }

  checkCollisions(){
    const containerRects = this.containers.map(c=>{
      if(!c.element) return null;
      const r = c.element.getBoundingClientRect();
      return {kind:c.kind,left:r.left,right:r.right};
    }).filter(r=>r);

    this.activeItems.forEach(item=>{
      const itemX = item.x/100*window.innerWidth;
      containerRects.forEach(r=>{
        if(r && itemX >= r.left && itemX <= r.right && item.y>=window.innerHeight-120){
          // atrapó el item
          const correct = item.kind.includes(r.kind);
          if(correct){
            this.score += 10;
            this.showAnim('+10', 'lime', item.x);
          } else {
            this.score = Math.max(0,this.score-5);
            this.showAnim('-5','red', item.x);
          }
          item.y = window.innerHeight+100; // eliminar
        }
      });
    });
  }

  showAnim(text:string,color:string,xPct:number){
    const el = document.createElement('div');
    el.innerText = text;
    el.style.position = 'absolute';
    el.style.left = xPct+'%';
    el.style.top = '50px';
    el.style.fontSize = '20px';
    el.style.color = color;
    el.style.fontWeight = 'bold';
    el.style.transition = 'all 0.8s ease-out';
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.top='0px'; el.style.opacity='0'; setTimeout(()=>el.remove(),800); },10);
  }

  endGame(){
    this.running=false;
    this.stopGame();
    this.modalCtrl.create({
      component: GameOverModalComponent,
      componentProps:{score:this.score,level:this.level}
    }).then(m=>m.present());
  }

  uuid(){ return Math.random().toString(36).slice(2,9); }
}
