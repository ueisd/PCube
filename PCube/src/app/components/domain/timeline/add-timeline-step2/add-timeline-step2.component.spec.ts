import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineStep2Component } from './add-timeline-step2.component';

describe('AddTimelineStep2Component', () => {
  let component: AddTimelineStep2Component;
  let fixture: ComponentFixture<AddTimelineStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
