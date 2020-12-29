import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[selectNonZero]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SelectZeroValidatorDirective,
    multi: true
  }]
})
export class SelectZeroValidatorDirective  implements Validator{

  constructor() { }
  validate(control: AbstractControl) : {[key: string]: any} | null {
    if (control.value == 0) {
      return { 'selectZeroInvalid': true }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }

}
