import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineStep4Component } from './add-timeline-step4.component';

describe('AddTimelineStep4Component', () => {
  let component: AddTimelineStep4Component;
  let fixture: ComponentFixture<AddTimelineStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
