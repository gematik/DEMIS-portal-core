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

import { ConfigOption } from '@ngx-formly/core';
import { DATEPICKER_VALIDATION_MESSAGES } from '../components/formly-datepicker/datepicker-validation-messages';
import { FormlyDatepickerComponent } from '../components/formly-datepicker/formly-datepicker.component';
import { FormlyFilterableSelectComponent } from '../components/formly-filterable-select/formly-filterable-select.component';
import { FormlyRepeaterComponent } from '../components/formly-repeater/formly-repeater.component';

/**
 * Provides the DEMIS portal-core Formly configuration including all custom field types
 * and validation messages from the portal-core library.
 *
 * Registers the following types:
 * - `datepicker` — {@link FormlyDatepickerComponent} (with `form-field` wrapper)
 * - `repeater` — {@link FormlyRepeaterComponent}
 * - `filterable-select` — {@link FormlyFilterableSelectComponent} (with `form-field` wrapper)
 *
 * Also includes {@link DATEPICKER_VALIDATION_MESSAGES}.
 *
 * @example
 * ```typescript
 * provideFormlyCore([
 *   ...withFormlyMaterial(),
 *   { types: [...], wrappers: [...] },  // app-specific config
 *   ...withDemisFormlyCore(),
 * ])
 * ```
 *
 * @returns An array of {@link ConfigOption} to spread into `provideFormlyCore()`.
 */
export function withDemisFormlyCore(): ConfigOption[] {
  return [
    {
      types: [
        { name: 'datepicker', component: FormlyDatepickerComponent, wrappers: ['form-field'] },
        { name: 'repeater', component: FormlyRepeaterComponent },
        { name: 'filterable-select', component: FormlyFilterableSelectComponent, wrappers: ['form-field'] },
      ],
      validationMessages: [...DATEPICKER_VALIDATION_MESSAGES],
    },
  ];
}
