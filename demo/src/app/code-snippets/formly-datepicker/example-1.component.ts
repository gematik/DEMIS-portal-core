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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-datepicker-example-1',
  templateUrl: './example-1.component.html',
  imports: [FormlyModule, FormsModule, ReactiveFormsModule],
})
export class FormlyDatepickerExample1Component {
  form = new FormGroup({});
  model: FormModel = {
    lastTimeAtDentist: undefined,
  };
  fields: FormlyFieldConfig[] = [
    {
      id: 'lastTimeAtDentist',
      key: 'lastTimeAtDentist',
      type: 'datepicker',
      props: {
        label: 'Letzter Besuch beim Zahnarzt (seit 2020)',
        allowedPrecisions: ['day', 'month'],
        required: true,
        minDate: new Date('2020-01-01'),
        maxDate: new Date(),
      },
      defaultValue: '2022-02',
    },
  ];

  onSend(value: string) {
    this.model.lastTimeAtDentist = value;
    const control = this.form.get<string>('lastTimeAtDentist') as FormControl<string>;
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
    }
  }
}

interface FormModel {
  lastTimeAtDentist: string | null | undefined;
}
