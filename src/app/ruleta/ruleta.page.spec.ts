import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuletaPage } from './ruleta.page';

describe('RuletaPage', () => {
  let component: RuletaPage;
  let fixture: ComponentFixture<RuletaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RuletaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
