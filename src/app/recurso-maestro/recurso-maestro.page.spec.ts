import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursoMaestroPage } from './recurso-maestro.page';

describe('RecursoMaestroPage', () => {
  let component: RecursoMaestroPage;
  let fixture: ComponentFixture<RecursoMaestroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursoMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
