import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineStep3Component } from './add-timeline-step3.component';

describe('AddTimelineStep3Component', () => {
  let component: AddTimelineStep3Component;
  let fixture: ComponentFixture<AddTimelineStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
