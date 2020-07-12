import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenseAccountComponent } from './delete-expense-account.component';

describe('DeleteExpenseAccountComponent', () => {
  let component: DeleteExpenseAccountComponent;
  let fixture: ComponentFixture<DeleteExpenseAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteExpenseAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteExpenseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
