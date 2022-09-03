import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

export class FormValidatorBuilder {
  validationMessages;

  constructor(validationMessages) {
    this.validationMessages = validationMessages;
  }

  public generateCustomAsyncValidator(params: { field: string; validatorFn: (val: any) => Observable<any>; error: { type: string; message: string } }) {
    this.addMessages(params.field, [{ type: params.error.type, message: params.error.message }]);
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return params.validatorFn(control.value).pipe(
        map((result: boolean) => {
          if (!result) {
            return null;
          }
          return { [params.error.type]: params.error.message };
        })
      );
    };
  }

  public buildCustomSyncValidator(params: { field: string; isErrorFn: (control: AbstractControl) => boolean; error: { type: string; message: string } }) {
    this.addMessages(params.field, [{ type: params.error.type, message: params.error.message }]);
    return (control: AbstractControl): any | null => {
      const isError = params.isErrorFn(control);
      if (!isError) {
        return null;
      }
      control.get(params.field).setErrors({ [params.error.type]: true });
    };
  }

  public buildComposedSyncValidators(params: { field: string; validators: { error: { type: string; message: string }; validator: any }[] }) {
    const validators = [];
    _.forEach(params.validators, (validatorConf) => {
      validators.push(validatorConf.validator);
      this.addMessages(params.field, [{ type: validatorConf.error.type, message: validatorConf.error.message }]);
    });

    return validators;
  }

  public buildStringValidators(params: { field: string; label: string; required?: boolean; min?: number; max?: number }) {
    const validatorList = [];

    // Todo avoir un lancement d'erreur quand on a deja buildé la champ

    if (params.required) {
      validatorList.push(Validators.required);
      this.addMessages(params.field, [{ type: 'required', message: `Un ${params.label} est requis` }]);
    }

    if (params.min) {
      validatorList.push(Validators.minLength(params.min));
      this.addMessages(params.field, [{ type: 'minlength', message: `Minimum ${params.min} caractères` }]);
    }

    if (params.max) {
      validatorList.push(Validators.maxLength(params.max));
      this.addMessages(params.field, [{ type: 'maxlength', message: `Maximum ${params.max} caractères` }]);
    }

    return validatorList;
  }

  public addMessages(path, messages: { type: string; message: string }[]) {
    const messagesVal = _.get(this.validationMessages, path);
    if (messagesVal) {
      _.set(this.validationMessages, path, [...messagesVal, ...messages]);
    } else {
      _.set(this.validationMessages, path, messages);
    }
  }
}
