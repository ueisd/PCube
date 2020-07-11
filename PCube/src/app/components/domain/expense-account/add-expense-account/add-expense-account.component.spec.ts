import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseAccountComponent } from './add-expense-account.component';

describe('AddExpenseAccountComponent', () => {
  let component: AddExpenseAccountComponent;
  let fixture: ComponentFixture<AddExpenseAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExpenseAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
