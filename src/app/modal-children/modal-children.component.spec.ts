import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalChildrenComponent } from './modal-children.component';

describe('ModalChildrenComponent', () => {
  let component: ModalChildrenComponent;
  let fixture: ComponentFixture<ModalChildrenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalChildrenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
