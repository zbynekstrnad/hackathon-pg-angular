import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Slice2Component } from './slice2.component';

describe('Slice2Component', () => {
  let component: Slice2Component;
  let fixture: ComponentFixture<Slice2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Slice2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Slice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
