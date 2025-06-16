import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-seccion-ly-l',
  templateUrl: './seccion-ly-l.page.html',
  styleUrls: ['./seccion-ly-l.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SeccionLyLPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
