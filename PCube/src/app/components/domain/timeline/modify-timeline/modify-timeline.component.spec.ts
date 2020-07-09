import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTimelineComponent } from './modify-timeline.component';

describe('ModifyTimelineComponent', () => {
  let component: ModifyTimelineComponent;
  let fixture: ComponentFixture<ModifyTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
