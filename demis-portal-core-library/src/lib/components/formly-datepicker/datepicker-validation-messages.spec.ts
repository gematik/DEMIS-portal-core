/*
    Copyright (c) 2026 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';
import { DATEPICKER_VALIDATION_MESSAGES } from './datepicker-validation-messages';

/**
 * Helper to find a validation message entry by name and invoke its message function.
 */
function getMessage(name: string, error: unknown, field: FormlyFieldConfig): string {
  const entry = DATEPICKER_VALIDATION_MESSAGES.find(m => m.name === name);
  expect(entry).toBeTruthy();
  return (entry!.message as Function)(error, field);
}

describe('datepicker-validation-messages', () => {
  describe('formatMismatch', () => {
    it('should list all allowed date formats from allowedPrecisions', () => {
      const field: FormlyFieldConfig = {
        props: {
          allowedPrecisions: ['day', 'month', 'year'],
        },
      };

      const result = getMessage('formatMismatch', true, field);
      expect(result).toBe('Es sind nur folgende Formate erlaubt: TT.MM.JJJJ | MM.JJJJ | JJJJ');
    });

    it('should show single format when only day precision is allowed', () => {
      const field: FormlyFieldConfig = {
        props: {
          allowedPrecisions: ['day'],
        },
      };

      const result = getMessage('formatMismatch', true, field);
      expect(result).toBe('Es sind nur folgende Formate erlaubt: TT.MM.JJJJ');
    });

    it('should default to all precisions when allowedPrecisions is not set', () => {
      const field: FormlyFieldConfig = {
        props: {},
      };

      const result = getMessage('formatMismatch', true, field);
      expect(result).toBe('Es sind nur folgende Formate erlaubt: TT.MM.JJJJ | MM.JJJJ | JJJJ');
    });

    it('should default all precisions precision when props is undefined', () => {
      const field: FormlyFieldConfig = {};

      const result = getMessage('formatMismatch', true, field);
      expect(result).toBe('Es sind nur folgende Formate erlaubt: TT.MM.JJJJ | MM.JJJJ | JJJJ');
    });

    it('should show month and year formats', () => {
      const field: FormlyFieldConfig = {
        props: {
          allowedPrecisions: ['month', 'year'],
        },
      };

      const result = getMessage('formatMismatch', true, field);
      expect(result).toBe('Es sind nur folgende Formate erlaubt: MM.JJJJ | JJJJ');
    });
  });

  describe('invalidDate', () => {
    it('should show message without raw value when formControl value is a Date', () => {
      const field: FormlyFieldConfig = {
        formControl: new FormControl(new Date('2022-06-15')),
      };

      const result = getMessage('invalidDate', true, field);
      expect(result).toBe('Das eingegebene Datum ist ungültig');
    });

    it('should show message with raw value when formControl value is a string', () => {
      const field: FormlyFieldConfig = {
        formControl: new FormControl('31.02.2022'),
      };

      const result = getMessage('invalidDate', true, field);
      expect(result).toBe('Das eingegebene Datum "31.02.2022" ist ungültig');
    });

    it('should show message without raw value when formControl value is null', () => {
      const field: FormlyFieldConfig = {
        formControl: new FormControl(null),
      };

      const result = getMessage('invalidDate', true, field);
      expect(result).toBe('Das eingegebene Datum ist ungültig');
    });

    it('should show message without raw value when formControl value is a number', () => {
      const field: FormlyFieldConfig = {
        formControl: new FormControl(12345),
      };

      const result = getMessage('invalidDate', true, field);
      expect(result).toBe('Das eingegebene Datum ist ungültig');
    });

    it('should show message without raw value when formControl is undefined', () => {
      const field: FormlyFieldConfig = {};

      const result = getMessage('invalidDate', true, field);
      expect(result).toBe('Das eingegebene Datum ist ungültig');
    });
  });

  describe('matDatepickerMin', () => {
    it('should return default message with formatted min date', () => {
      const field: FormlyFieldConfig = {};
      const error = { min: new Date('2022-01-15') };

      const result = getMessage('matDatepickerMin', error, field);
      expect(result).toBe('Das Datum darf nicht vor dem 15.01.2022 liegen');
    });

    it('should return custom minDate message when provided in validation.messages', () => {
      const field: FormlyFieldConfig = {
        validation: {
          messages: {
            minDate: 'Bitte ein späteres Datum wählen',
          },
        },
      };
      const error = { min: new Date('2022-01-15') };

      const result = getMessage('matDatepickerMin', error, field);
      expect(result).toBe('Bitte ein späteres Datum wählen');
    });

    it('should return default message when validation.messages exists but minDate is not a string', () => {
      const field: FormlyFieldConfig = {
        validation: {
          messages: {
            minDate: 42 as any,
          },
        },
      };
      const error = { min: new Date('2023-06-01') };

      const result = getMessage('matDatepickerMin', error, field);
      expect(result).toBe('Das Datum darf nicht vor dem 01.06.2023 liegen');
    });

    it('should return default message when validation exists but messages is undefined', () => {
      const field: FormlyFieldConfig = {
        validation: {},
      };
      const error = { min: new Date('2020-12-25') };

      const result = getMessage('matDatepickerMin', error, field);
      expect(result).toBe('Das Datum darf nicht vor dem 25.12.2020 liegen');
    });
  });

  describe('matDatepickerMax', () => {
    it('should return default message with formatted max date', () => {
      const field: FormlyFieldConfig = {};
      const error = { max: new Date('2025-12-31') };

      const result = getMessage('matDatepickerMax', error, field);
      expect(result).toBe('Das Datum darf nicht nach dem 31.12.2025 liegen');
    });

    it('should return custom maxDate message when provided in validation.messages', () => {
      const field: FormlyFieldConfig = {
        validation: {
          messages: {
            maxDate: 'Datum liegt zu weit in der Zukunft',
          },
        },
      };
      const error = { max: new Date('2025-12-31') };

      const result = getMessage('matDatepickerMax', error, field);
      expect(result).toBe('Datum liegt zu weit in der Zukunft');
    });

    it('should return default message when validation.messages exists but maxDate is not a string', () => {
      const field: FormlyFieldConfig = {
        validation: {
          messages: {
            maxDate: undefined as any,
          },
        },
      };
      const error = { max: new Date('2024-07-04') };

      const result = getMessage('matDatepickerMax', error, field);
      expect(result).toBe('Das Datum darf nicht nach dem 04.07.2024 liegen');
    });

    it('should return default message when validation exists but messages is undefined', () => {
      const field: FormlyFieldConfig = {
        validation: {},
      };
      const error = { max: new Date('2023-03-15') };

      const result = getMessage('matDatepickerMax', error, field);
      expect(result).toBe('Das Datum darf nicht nach dem 15.03.2023 liegen');
    });
  });

  describe('DATEPICKER_VALIDATION_MESSAGES structure', () => {
    it('should contain exactly 4 validation messages', () => {
      expect(DATEPICKER_VALIDATION_MESSAGES.length).toBe(4);
    });

    it('should have the correct message names', () => {
      const names = DATEPICKER_VALIDATION_MESSAGES.map(m => m.name);
      expect(names).toEqual(['formatMismatch', 'invalidDate', 'matDatepickerMin', 'matDatepickerMax']);
    });

    it('should have function-typed message properties', () => {
      DATEPICKER_VALIDATION_MESSAGES.forEach(entry => {
        expect(typeof entry.message).toBe('function');
      });
    });
  });
});
