import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCheckoutComponent } from './request-checkout.component';

describe('RequestCheckoutComponent', () => {
  let component: RequestCheckoutComponent;
  let fixture: ComponentFixture<RequestCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
