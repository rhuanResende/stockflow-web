import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DsErrorCodeProcessed } from '@rhuanResende/design-system';

export function confirmPasswordValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {

    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) {
      return null;
    }

    if (!newPasswordControl.value || !confirmPasswordControl.value) {
      return null;
    }

    if (newPasswordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({
        [DsErrorCodeProcessed.customErrors]: {
          message: 'As senhas informadas são diferentes.',
        },
      });

      return {
        [DsErrorCodeProcessed.customErrors]: true,
      };
    }

    if (confirmPasswordControl.errors?.[DsErrorCodeProcessed.customErrors]) {
      const errors = { ...confirmPasswordControl.errors };

      delete errors[DsErrorCodeProcessed.customErrors];

      confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }
}
