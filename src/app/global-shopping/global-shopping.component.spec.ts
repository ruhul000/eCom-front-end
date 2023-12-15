import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalShoppingComponent } from './global-shopping.component';

describe('GlobalShoppingComponent', () => {
  let component: GlobalShoppingComponent;
  let fixture: ComponentFixture<GlobalShoppingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalShoppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
