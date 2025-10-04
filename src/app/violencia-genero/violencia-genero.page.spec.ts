import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViolenciaGeneroPage } from './violencia-genero.page';

describe('ViolenciaGeneroPage', () => {
  let component: ViolenciaGeneroPage;
  let fixture: ComponentFixture<ViolenciaGeneroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolenciaGeneroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
