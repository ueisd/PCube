import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyingTimelineComponent } from './modifying-timeline.component';

describe('ModifyingTimelineComponent', () => {
  let component: ModifyingTimelineComponent;
  let fixture: ComponentFixture<ModifyingTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyingTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
