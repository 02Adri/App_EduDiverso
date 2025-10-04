import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadMaestroComponent } from './upload-maestro.component';

describe('UploadMaestroComponent', () => {
  let component: UploadMaestroComponent;
  let fixture: ComponentFixture<UploadMaestroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UploadMaestroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
