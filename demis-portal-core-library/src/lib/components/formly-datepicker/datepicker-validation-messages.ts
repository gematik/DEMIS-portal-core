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

import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';
import { format } from 'date-fns';
import { DatepickerCustomProps, DEFAULT_PRECISION_LEVEL, VALID_FORMATS } from './datepicker-shared';

/**
 * Type extracted from ConfigOption['validationMessages'] since ValidationMessageOption
 * is not directly exported from @ngx-formly/core.
 */
type ValidationMessageOption = NonNullable<ConfigOption['validationMessages']>[number];

/**
 * Generates a hint string showing all allowed date formats.
 * @param field - The Formly field configuration
 * @returns A string with allowed formats (e.g., "TT.MM.JJJJ | MM.JJJJ")
 */
function getAllowedDateFormats(field: FormlyFieldConfig): string {
  const props = field.props as DatepickerCustomProps;
  const allowedPrecisions = props?.allowedPrecisions ?? DEFAULT_PRECISION_LEVEL;
  return allowedPrecisions.map(precision => VALID_FORMATS.get(precision)?.display).join(' | ');
}

/**
 * Validation messages for the datepicker field type.
 * These messages are designed to work with the form-field wrapper from @ngx-formly/material.
 *
 * Usage: Add these to the `validationMessages` array in your Formly configuration:
 *
 * @example
 * ```typescript
 * provideFormlyCore([
 *   ...withFormlyMaterial(),
 *   {
 *     validationMessages: [...DATEPICKER_VALIDATION_MESSAGES],
 *     types: [
 *       {
 *         name: 'datepicker',
 *         component: FormlyDatepickerComponent,
 *         wrappers: ['form-field'],
 *       },
 *     ],
 *   },
 * ]);
 * ```
 *
 * Note: Per-field messages can still be overridden using `validation.messages` in the field config:
 * ```typescript
 * {
 *   key: 'date',
 *   type: 'datepicker',
 *   validation: {
 *     messages: {
 *       matDatepickerMin: 'Custom min date message',
 *     },
 *   },
 * }
 * ```
 */
export const DATEPICKER_VALIDATION_MESSAGES: ValidationMessageOption[] = [
  {
    name: 'formatMismatch',
    message: (error: unknown, field: FormlyFieldConfig) => {
      const allowedDateFormats = getAllowedDateFormats(field);
      return `Es sind nur folgende Formate erlaubt: ${allowedDateFormats}`;
    },
  },
  {
    name: 'invalidDate',
    message: (error: unknown, field: FormlyFieldConfig) => {
      const rawValue = field.formControl?.value;
      const isVisibleInInput = rawValue instanceof Date;
      const showRaw = !isVisibleInInput && typeof rawValue === 'string';
      const rawSuffix = showRaw ? ` "${rawValue}"` : '';
      return `Das eingegebene Datum${rawSuffix} ist ungültig`;
    },
  },
  {
    name: 'matDatepickerMin',
    message: (error: unknown, field: FormlyFieldConfig) => {
      const customMessage = field.validation?.messages?.['minDate'];
      if (typeof customMessage === 'string') {
        return customMessage;
      }
      const minError = error as { min: Date };
      return `Das Datum darf nicht vor dem ${format(minError.min, 'dd.MM.yyyy')} liegen`;
    },
  },
  {
    name: 'matDatepickerMax',
    message: (error: unknown, field: FormlyFieldConfig) => {
      const customMessage = field.validation?.messages?.['maxDate'];
      if (typeof customMessage === 'string') {
        return customMessage;
      }
      const maxError = error as { max: Date };
      return `Das Datum darf nicht nach dem ${format(maxError.max, 'dd.MM.yyyy')} liegen`;
    },
  },
];
