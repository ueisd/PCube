import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingTimelineComponent } from './adding-timeline.component';

describe('AddingTimelineComponent', () => {
  let component: AddingTimelineComponent;
  let fixture: ComponentFixture<AddingTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
