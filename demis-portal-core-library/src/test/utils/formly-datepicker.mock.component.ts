/*
    Copyright (c) 2025 gematik GmbH
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

import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [FormlyModule, ReactiveFormsModule],
  standalone: true,
})
export class FormlyDatepickerMockComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'datepickerAllPrecisionLevels',
      key: 'datepickerAllPrecisionLevels',
      type: 'datepicker',
      props: {
        label: 'Datepicker with all precision levels',
        allowedPrecisions: ['day', 'month', 'year'],
      },
    },
    {
      id: 'datepickerWithConstraints',
      key: 'datepickerWithConstraints',
      type: 'datepicker',
      props: {
        label: 'Geburtstag',
        allowedPrecisions: ['day'],
        required: true,
        minDate: new Date('1870-01-01'),
        maxDate: new Date(),
      },
    },
    {
      id: 'datepickerWithValidationMessage',
      key: 'datepickerWithValidationMessage',
      type: 'datepicker',
      props: {
        label: 'Foo',
        allowedPrecisions: ['day'],
        required: true,
        minDate: new Date('1870-01-01'),
        maxDate: new Date('2025-01-01'),
      },
      validation: {
        messages: {
          required: 'A message from consuming app on error of type required',
          minDate: 'A message from consuming app on error of type minDate',
          maxDate: 'A message from consuming app on error of type maxDate',
        },
      },
    },
    {
      id: 'defaultDatepicker',
      key: 'defaultDatepicker',
      type: 'datepicker',
    },
    {
      id: 'defaultDatepickerMandatory',
      key: 'defaultDatepickerMandatory',
      type: 'datepicker',
      props: {
        required: true,
      },
    },
    {
      id: 'withDefaultValue_IsoDay',
      key: 'withDefaultValue_IsoDay',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025-02-13',
    },
    {
      id: 'withDefaultValue_IsoMonth',
      key: 'withDefaultValue_IsoMonth',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025-02',
    },
    {
      id: 'withDefaultValue_Year',
      key: 'withDefaultValue_Year',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025',
    },
    {
      id: 'withDefaultValue_IsoMonth_defaultPrecision',
      key: 'withDefaultValue_IsoMonth_defaultPrecision',
      type: 'datepicker',
      defaultValue: '2025-02',
    },
    {
      id: 'multiYearDatepicker',
      key: 'multiYearDatepicker',
      type: 'datepicker',
      props: {
        multiYear: true,
        allowedPrecisions: ['day', 'month', 'year'],
      },
    },
    {
      id: 'datepickerWithTimeRange',
      key: 'datepickerWithTimeRange',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
        minDate: new Date('2000-01-01'),
        maxDate: new Date('2009-12-31'),
      },
    },
  ];
}
