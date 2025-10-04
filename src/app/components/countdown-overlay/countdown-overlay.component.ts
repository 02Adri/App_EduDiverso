import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-overlay',
  templateUrl: './countdown-overlay.component.html',
  styleUrls: ['./countdown-overlay.component.scss'],
  imports:[CommonModule]
})
export class CountdownOverlayComponent {
  show = false;
  display = '';
  @Output() finished = new EventEmitter<void>();

  async start() {
    this.show = true;
    const tick = new Audio('assets/game/sfx/tick.mp3');
    const go = new Audio('assets/game/sfx/go.mp3');
    for (const n of ['3', '2', '1']) {
      this.display = n;
      tick.play().catch(()=>{});
      await this.wait(650);
    }
    this.display = '¡YA!';
    go.play().catch(()=>{});
    await this.wait(600);
    this.show = false;
    this.finished.emit();
  }

  private wait(ms:number){ return new Promise(res => setTimeout(res, ms)); }
}
