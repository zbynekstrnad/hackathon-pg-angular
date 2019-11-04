import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Slice3Component } from './slice3.component';

describe('Slice3Component', () => {
  let component: Slice3Component;
  let fixture: ComponentFixture<Slice3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Slice3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Slice3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
