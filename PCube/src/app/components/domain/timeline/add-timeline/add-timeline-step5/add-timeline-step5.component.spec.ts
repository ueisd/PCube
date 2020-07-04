import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineStep5Component } from './add-timeline-step5.component';

describe('AddTimelineStep5Component', () => {
  let component: AddTimelineStep5Component;
  let fixture: ComponentFixture<AddTimelineStep5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineStep5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
