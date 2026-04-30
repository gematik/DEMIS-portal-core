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
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-filterable-select-example-2',
  templateUrl: './example-2.component.html',
  imports: [FormlyModule, ReactiveFormsModule, JsonPipe],
})
export class FilterableSelectExample2Component {
  form = new FormGroup({});
  model: Record<string, any> = {
    symptoms: [],
  };
  fields: FormlyFieldConfig[] = [
    {
      id: 'symptoms',
      key: 'symptoms',
      type: 'filterable-select',
      props: {
        label: 'Symptome',
        required: true,
        multiple: true,
        options: [
          { value: '386661006', label: 'Fieber' },
          { value: '49727002', label: 'Husten' },
          { value: '25064002', label: 'Kopfschmerzen' },
          { value: '84229001', label: 'Müdigkeit' },
          { value: '68962001', label: 'Muskelschmerzen' },
          { value: '64531003', label: 'Schnupfen' },
          { value: '162397003', label: 'Halsschmerzen' },
          { value: '267036007', label: 'Atemnot' },
          { value: '422587007', label: 'Übelkeit' },
          { value: '62315008', label: 'Durchfall' },
          { value: 'NASK', label: 'Nicht erhoben' },
        ],
        searchPlaceholder: 'Symptome suchen...',
      },
    },
  ];
}
