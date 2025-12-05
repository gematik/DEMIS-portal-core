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
  selector: 'app-formly-repeater-example-2',
  imports: [ReactiveFormsModule, FormlyModule],
  templateUrl: './example-2.component.html',
})
export class FormlyRepeaterExample2Component {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'firstName',
      key: 'firstName',
      type: 'input',
      props: {
        label: 'Vorname',
        required: true,
      },
    },
    {
      id: 'lastName',
      key: 'lastName',
      type: 'input',
      props: {
        label: 'Nachname',
        required: true,
      },
    },
    {
      id: 'pets',
      key: 'pets',
      type: 'repeat',
      defaultValue: [],
      props: {
        required: false,
        addButtonLabel: 'Haustier hinzufügen',
      },
      fieldArray: {
        fieldGroupClassName: 'd-flex flex-column',
        fieldGroup: [
          {
            id: 'petName',
            key: 'petName',
            type: 'input',
            props: {
              label: 'Name des Haustiers',
              required: true,
            },
          },
          {
            id: 'petCategory',
            key: 'petCategory',
            type: 'select',
            props: {
              label: 'Typ des Haustiers',
              required: true,
              options: [
                { label: 'Hund', value: 'dog' },
                { label: 'Katze', value: 'cat' },
                { label: 'Vogel', value: 'bird' },
                { label: 'Hamster', value: 'hamster' },
                { label: 'Fisch', value: 'fish' },
              ],
            },
          },
          {
            id: 'petAge',
            key: 'petAge',
            type: 'input',
            props: {
              label: 'Wie alt ist das Haustier?',
              type: 'number',
              required: true,
            },
          },
        ],
      },
    },
  ];
}
