import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstadisticasModalComponent } from './estadisticas-modal.component';

describe('EstadisticasModalComponent', () => {
  let component: EstadisticasModalComponent;
  let fixture: ComponentFixture<EstadisticasModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EstadisticasModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
