import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionLyLPage } from './seccion-ly-l.page';

describe('SeccionLyLPage', () => {
  let component: SeccionLyLPage;
  let fixture: ComponentFixture<SeccionLyLPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionLyLPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
