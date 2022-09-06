import { Component, OnInit, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FormValidatorBuilder } from '../../../utils/FormValidatorBuilder';

@Component({
  selector: 'app-add-expense-account',
  templateUrl: './add-expense-account.component.html',
  styleUrls: ['./add-expense-account.component.css'],
})
export class AddExpenseAccountComponent implements OnInit {
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  hasToRefresh = true;
  expenseAccount: ExpenseAccountItem;
  isCreateForm = false;
  parentOptions: ExpenseAccountItem[];
  errorMessage = null;
  ExpenseForm: FormGroup;
  validationMessages = {};

  canceledMessage = 'Canceled';

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private expenseAccountServices: ExpenseAccountService, private dialogRef: MatDialogRef<ExpenseAccountItem>) {}

  async ngOnInit(): Promise<void> {
    this.expenseAccount = this.data.expenseAccount;
    if (!(this.expenseAccount.id > 0)) {
      this.expenseAccount.id = -1;
    }
    if (!(this.expenseAccount.parent_id > 0)) {
      this.expenseAccount.parent_id = -1;
    }

    if (this.expenseAccount.id < 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.parentOptions = await this.expenseAccountServices.getParentOptions(this.expenseAccount.id).toPromise();
    const selected: ExpenseAccountItem = this.findExpenseAccount(this.parentOptions, this.expenseAccount.parent_id);
    if (this.expenseAccount.id !== this.expenseAccount.parent_id) {
      this.ExpenseForm.controls.parent.setValue(selected);
    }
  }

  private initValidators() {
    const validatorBuilder = new FormValidatorBuilder(this.validationMessages);

    const expenseAccountNameValidators = validatorBuilder.buildStringValidators({ field: 'name', label: 'nom', min: 5, max: 40, required: true });

    const nameUniqueAsyncValidator = validatorBuilder.generateCustomAsyncValidator({
      field: 'name',
      validatorFn: (val) => this.expenseAccountServices.isNameExist(val).pipe(map((isNameExist) => isNameExist && val !== this.expenseAccount.name)),
      error: { type: 'nameAlreadyExist', message: `Le nom n'est pas unique` },
    });

    return { expenseAccountNameValidators, nameUniqueAsyncValidator };
  }

  private initForm() {
    const { expenseAccountNameValidators, nameUniqueAsyncValidator } = this.initValidators();
    this.ExpenseForm = this.fb.group(
      {
        name: [this.expenseAccount.name, Validators.compose(expenseAccountNameValidators), [nameUniqueAsyncValidator]],
        isChild: [this.expenseAccount.parent_id > 0 && this.expenseAccount.parent_id !== this.expenseAccount.id],
        parent: [null],
      },
      { validators: this.validateForm }
    );
  }

  /* Trouve et retourne le ExpenseAccountItem avec id = @id dans une arborescence de account item
   *  Si ne trouve pas retourne null
   */
  private findExpenseAccount(accounts: ExpenseAccountItem[], id: number) {
    for (const account of accounts) {
      if (account.id === id) {
        return account;
      }
      if (account.id !== account.parent_id && account.child != null) {
        let trouve: ExpenseAccountItem = null;
        trouve = this.findExpenseAccount(account.child, id);
        return trouve;
      }
    }
    return null;
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  async onSubmit() {
    if (!this.ExpenseForm.invalid) {
      const name: string = this.ExpenseForm.controls.name.value;
      const parentAccout: ExpenseAccountItem = this.ExpenseForm.controls.parent.value;
      const parentName: string = parentAccout != null ? parentAccout.name : name;

      if (this.isCreateForm) {
        const proj: ExpenseAccountItem = new ExpenseAccountItem();
        if (this.ExpenseForm.value.isChild === false) {
          proj.parent_id = this.expenseAccount.id;
        } else if (this.ExpenseForm.value.parent) {
          proj.parent_id = this.ExpenseForm.value.parent.id;
        } else {
          proj.parent_id = this.expenseAccount.parent_id;
        }
        proj.name = this.ExpenseForm.value.name;

        try {
          const res = await this.expenseAccountServices.addExpenseAccount(proj).toPromise();
          this.onSubmitSuccess(res);
        } catch (err) {
          this.errorMessage = `${err.error.name} : ${err.error.message}`;
        }
      } else {
        const exp: ExpenseAccountItem = new ExpenseAccountItem();
        exp.id = this.expenseAccount.id;

        if (this.ExpenseForm.value.isChild === false || !this.ExpenseForm.value.parent) {
          exp.parent_id = null;
        } else {
          exp.parent_id = this.ExpenseForm.value.parent.id;
        }

        exp.name = this.ExpenseForm.value.name;
        await this.expenseAccountServices.updateExpenseAccount(exp).toPromise();
        this.onSubmitSuccess();
      }
    }
  }

  private onSubmitSuccess(expenseAccount?) {
    this.askForDataRefresh();
    this.dialogRef.close(expenseAccount);
  }

  isChildChecked(checked: boolean) {
    if (!checked) {
      this.ExpenseForm.get('parent').reset();
    }
    // à mettre lors de modification
    else if (!this.isCreateForm && this.expenseAccount.id !== this.expenseAccount.parent_id) {
      const selected: ExpenseAccountItem = this.findExpenseAccount(this.parentOptions, this.expenseAccount.parent_id);
      this.ExpenseForm.controls.parent.setValue(selected);
    }
  }

  validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return null;
  };

  public isFieldError(fieldName, validation, lazy?: boolean) {
    const isFieldError = this.ExpenseForm.get(fieldName).hasError(validation.type);
    if (lazy) {
      return isFieldError;
    }

    return isFieldError && (this.ExpenseForm.get(fieldName).dirty || this.ExpenseForm.get(fieldName).touched);
  }
}
