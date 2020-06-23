import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAddProjectComponent } from './project-add-project.component';

describe('ProjectAddProjectComponent', () => {
  let component: ProjectAddProjectComponent;
  let fixture: ComponentFixture<ProjectAddProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAddProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
