import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerContentComponent } from './project-manager-content.component';

describe('ProjectManagerContentComponent', () => {
  let component: ProjectManagerContentComponent;
  let fixture: ComponentFixture<ProjectManagerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectManagerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
