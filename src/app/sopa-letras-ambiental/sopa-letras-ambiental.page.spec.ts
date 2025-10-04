import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SopaLetrasAmbientalPage } from './sopa-letras-ambiental.page';

describe('SopaLetrasAmbientalPage', () => {
  let component: SopaLetrasAmbientalPage;
  let fixture: ComponentFixture<SopaLetrasAmbientalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SopaLetrasAmbientalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
