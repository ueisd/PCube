import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineStep1Component } from './add-timeline-step1.component';

describe('AddTimelineStep1Component', () => {
  let component: AddTimelineStep1Component;
  let fixture: ComponentFixture<AddTimelineStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
