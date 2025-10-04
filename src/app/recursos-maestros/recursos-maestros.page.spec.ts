import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursosMaestrosPage } from './recursos-maestros.page';

describe('RecursosMaestrosPage', () => {
  let component: RecursosMaestrosPage;
  let fixture: ComponentFixture<RecursosMaestrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosMaestrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
