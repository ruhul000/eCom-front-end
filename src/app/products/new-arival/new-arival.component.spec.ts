import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArivalComponent } from './new-arival.component';

describe('NewArivalComponent', () => {
  let component: NewArivalComponent;
  let fixture: ComponentFixture<NewArivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewArivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
