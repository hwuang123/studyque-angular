import { Validator, AbstractControl, NG_VALIDATORS } from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
    selector: "[validateEqual]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: EqualValidatorDirective,
        multi: true
    }]
})
export class EqualValidatorDirective implements Validator {
    @Input() validateEqual: string;
    validate(c: AbstractControl): { [key: string]: any; } | null{
        const controlToCompare = c.parent.get(this.validateEqual)
        // if (controlToCompare && controlToCompare.value == c.value) return { "equal": true };
        if (controlToCompare && controlToCompare.value == c.value){
            return null;
        }
        return { "notEqual": true }
    }
}