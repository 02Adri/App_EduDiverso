import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadAmbientalPage } from './seguridad-ambiental.page';

describe('SeguridadAmbientalPage', () => {
  let component: SeguridadAmbientalPage;
  let fixture: ComponentFixture<SeguridadAmbientalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguridadAmbientalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
