import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvTestComponent } from './envtest.component';

describe('TestComponent', () => {
  let component: EnvTestComponent;
  let fixture: ComponentFixture<EnvTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
