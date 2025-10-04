import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuegoSapitoPage } from './juego-sapito.page';

describe('JuegoSapitoPage', () => {
  let component: JuegoSapitoPage;
  let fixture: ComponentFixture<JuegoSapitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoSapitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
