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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { Component } from '@angular/core';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-formly-datepicker-example-2',
  standalone: true,
  templateUrl: './example-2.component.html',
  imports: [FormlyModule, FormsModule, ReactiveFormsModule, JsonPipe],
})
export class FormlyDatepickerExample2Component {
  form = new FormGroup({});
  model: FormModel = {
    firstTimeInSpain: null,
  };
  fields: FormlyFieldConfig[] = [
    {
      id: 'firstTimeInSpain',
      key: 'firstTimeInSpain',
      type: 'datepicker',
      props: {
        label: 'Erster Aufenthalt in Spanien',
        allowedPrecisions: ['day', 'month', 'year'],
        multiYear: true,
        minDate: new Date('1980-01-01'),
        maxDate: new Date('2078-12-31'),
      },
    },
  ];
}

interface FormModel {
  firstTimeInSpain: string | null;
}
