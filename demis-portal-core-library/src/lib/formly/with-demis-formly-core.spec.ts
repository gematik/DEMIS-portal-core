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

import { FormlyDatepickerComponent } from '../components/formly-datepicker/formly-datepicker.component';
import { FormlyFilterableSelectComponent } from '../components/formly-filterable-select/formly-filterable-select.component';
import { FormlyRepeaterComponent } from '../components/formly-repeater/formly-repeater.component';
import { DATEPICKER_VALIDATION_MESSAGES } from '../components/formly-datepicker/datepicker-validation-messages';
import { withDemisFormlyCore } from './with-demis-formly-core';

describe('withDemisFormlyCore', () => {
  it('should return an array with one config option', () => {
    const result = withDemisFormlyCore();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(1);
  });

  it('should register datepicker, repeater, and filterable-select types', () => {
    const [config] = withDemisFormlyCore();
    const types = config.types!;
    expect(types.length).toBe(3);

    expect(types[0]).toEqual({ name: 'datepicker', component: FormlyDatepickerComponent, wrappers: ['form-field'] });
    expect(types[1]).toEqual({ name: 'repeater', component: FormlyRepeaterComponent });
    expect(types[2]).toEqual({ name: 'filterable-select', component: FormlyFilterableSelectComponent, wrappers: ['form-field'] });
  });

  it('should include datepicker validation messages', () => {
    const [config] = withDemisFormlyCore();
    expect(config.validationMessages).toEqual([...DATEPICKER_VALIDATION_MESSAGES]);
  });
});
