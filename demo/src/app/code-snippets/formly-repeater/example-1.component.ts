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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-repeater-example-1',
  imports: [ReactiveFormsModule, FormlyModule],
  templateUrl: './example-1.component.html',
})
export class FormlyRepeaterExample1Component {
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
      id: 'canBeDeleted',
      key: 'canBeDeleted',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Letzte E-Mail ist löschbar',
      },
    },
    {
      id: 'emails',
      key: 'emails',
      type: 'repeat',
      props: {
        addButtonLabel: 'E-Mail hinzufügen',
        showAddButtonLabel: true,
      },
      expressions: {
        'props.required': (field: FormlyFieldConfig) => field.form?.get('canBeDeleted')?.value === false,
      },
      fieldArray: {
        fieldGroup: [
          {
            id: 'email',
            key: 'email',
            type: 'input',
            props: {
              label: 'E-Mail',
              required: true,
            },
          },
        ],
      },
    },
    {
      className: 'col-sm-12 mt-sm-3',
      template: `<p>Bitte geben Sie mindestens eine Tel-Nr. an.</p>`,
    },
    {
      id: 'phoneNumbers',
      key: 'phoneNumbers',
      type: 'repeat',
      props: {
        required: true,
      },
      fieldArray: {
        fieldGroup: [
          {
            id: 'phone',
            key: 'phone',
            type: 'input',
            props: {
              label: 'Telefon-Nr.',
              required: true,
            },
          },
        ],
      },
    },
  ];
}
