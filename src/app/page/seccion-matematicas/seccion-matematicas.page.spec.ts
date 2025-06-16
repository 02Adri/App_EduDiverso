import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionMatematicasPage } from './seccion-matematicas.page';

describe('SeccionMatematicasPage', () => {
  let component: SeccionMatematicasPage;
  let fixture: ComponentFixture<SeccionMatematicasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionMatematicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
