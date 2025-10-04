import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SopaLetrasViolenciaPage } from './sopa-letras-violencia.page';

describe('SopaLetrasViolenciaPage', () => {
  let component: SopaLetrasViolenciaPage;
  let fixture: ComponentFixture<SopaLetrasViolenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SopaLetrasViolenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
