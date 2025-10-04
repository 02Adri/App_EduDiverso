import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuegoEstereotiposPage } from './juego-estereotipos.page';

describe('JuegoEstereotiposPage', () => {
  let component: JuegoEstereotiposPage;
  let fixture: ComponentFixture<JuegoEstereotiposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoEstereotiposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
