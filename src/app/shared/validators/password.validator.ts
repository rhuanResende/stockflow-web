import { DsErrorCodeProcessed } from '@rhuanResende/design-system';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const messages: string[] = [];

    if (value.length < 8) {
      messages.push('Mínimo de 8 caracteres');
    }

    if (!/[A-Z]/.test(value)) {
      messages.push('Pelo menos uma letra maiúscula');
    }

    if (!/\d/.test(value)) {
      messages.push('Pelo menos um número');
    }

    if (!/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(value)) {
      messages.push('Pelo menos um caractere especial');
    }

    return messages.length
      ? {
          [DsErrorCodeProcessed.customErrors]: {
            message: messages.join(DsErrorCodeProcessed.customErrors),
          },
        }
      : null;
  };
}
