import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAccountListComponent } from './expense-account-list.component';

describe('ExpenseAccountListComponent', () => {
  let component: ExpenseAccountListComponent;
  let fixture: ComponentFixture<ExpenseAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
