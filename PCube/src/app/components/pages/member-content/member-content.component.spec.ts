import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberContentComponent } from './member-content.component';

describe('MemberContentComponent', () => {
  let component: MemberContentComponent;
  let fixture: ComponentFixture<MemberContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
