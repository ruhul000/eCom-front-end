import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureProductComponent } from './feature-product.component';

describe('FeatureProductComponent', () => {
  let component: FeatureProductComponent;
  let fixture: ComponentFixture<FeatureProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
