import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTimelineComponent } from './delete-timeline.component';

describe('DeleteTimelineComponent', () => {
  let component: DeleteTimelineComponent;
  let fixture: ComponentFixture<DeleteTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
