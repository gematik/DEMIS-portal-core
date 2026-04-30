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

import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { SelectOption } from '../../lib/components/formly-filterable-select/filterable-select-shared';

export const MOCK_OPTIONS: SelectOption[] = [
  { value: 'OPT1', label: 'Option Alpha' },
  { value: 'OPT2', label: 'Option Beta' },
  { value: 'OPT3', label: 'Option Gamma' },
  { value: 'OPT4', label: 'Delta Element', description: 'Kategorie > Unterkategorie' },
  { value: 'OPT5', label: 'Epsilon Eintrag' },
];

@Component({
  selector: 'app-test-filterable-select-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model" />
    </form>
  `,
  imports: [FormlyModule, ReactiveFormsModule],
  standalone: true,
})
export class FormlyFilterableSelectMockComponent {
  form: FormGroup<any> = new FormGroup({});
  model: Record<string, any> = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'singleSelect',
      key: 'singleSelect',
      type: 'filterable-select',
      props: {
        label: 'Einzelauswahl',
        options: MOCK_OPTIONS,
        multiple: false,
      },
    },
    {
      id: 'multiSelect',
      key: 'multiSelect',
      type: 'filterable-select',
      props: {
        label: 'Mehrfachauswahl',
        options: MOCK_OPTIONS,
        multiple: true,
      },
    },
    {
      id: 'selectWithCode',
      key: 'selectWithCode',
      type: 'filterable-select',
      props: {
        label: 'Auswahl mit Wert',
        options: MOCK_OPTIONS,
        showValue: true,
      },
    },
    {
      id: 'requiredSelect',
      key: 'requiredSelect',
      type: 'filterable-select',
      props: {
        label: 'Pflichtauswahl',
        options: MOCK_OPTIONS,
        required: true,
      },
    },
    {
      id: 'noOptionsSelect',
      key: 'noOptionsSelect',
      type: 'filterable-select',
      props: {
        label: 'No Options',
      },
    },
  ];
}
