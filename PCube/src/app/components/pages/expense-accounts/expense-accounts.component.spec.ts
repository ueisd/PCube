import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAccountsComponent } from './expense-accounts.component';

describe('ExpenseAccountsComponent', () => {
  let component: ExpenseAccountsComponent;
  let fixture: ComponentFixture<ExpenseAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
