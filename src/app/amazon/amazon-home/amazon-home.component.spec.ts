import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonHomeComponent } from './amazon-home.component';

describe('AmazonHomeComponent', () => {
  let component: AmazonHomeComponent;
  let fixture: ComponentFixture<AmazonHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmazonHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
