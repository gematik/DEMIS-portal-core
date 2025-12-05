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
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-datepicker-example-3',
  standalone: true,
  templateUrl: './example-3.component.html',
  imports: [FormlyModule, ReactiveFormsModule],
})
export class FormlyDatepickerExample3Component {
  form = new FormGroup({});
  model: FormModel = {
    immunization1: null,
    immunization2: null,
  };
  fields: FormlyFieldConfig[] = [
    {
      id: 'immunization1',
      key: 'immunization1',
      type: 'datepicker',
      props: {
        label: '1. Impfung',
        allowedPrecisions: ['day'],
        minDate: new Date('2020-01-01'),
        maxDate: new Date(),
      },
    },
    {
      id: 'immunization2',
      key: 'immunization2',
      type: 'datepicker',
      props: {
        label: '2. Impfung',
        allowedPrecisions: ['day'],
        maxDate: new Date(),
      },
      expressions: {
        'props.minDate': (field: FormlyFieldConfig) => field.form?.get('immunization1')?.value ?? null,
      },
      validation: {
        messages: {
          minDate: '2. Impfung kann nicht vor der 1. Impfung stattfinden.',
        },
      },
    },
  ];
}

interface FormModel {
  immunization1: string | null;
  immunization2: string | null;
}
