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
import { filterableSelectField, SelectOption } from '@gematik/demis-portal-core-library';

const DISEASE_OPTIONS: SelectOption[] = [
  { value: 'clod', label: 'Botulismus' },
  { value: 'vchd', label: 'Cholera' },
  { value: 'cdfd', label: 'Clostridioides-difficile-Erkrankung, schwere Verlaufsform' },
  { value: 'cvdd', label: 'Coronavirus-Krankheit-2019 (COVID-19)' },
  { value: 'cjkd', label: 'Creutzfeldt-Jakob-Krankheit (CJK)' },
  { value: 'dend', label: 'Denguefieber' },
  { value: 'cord', label: 'Diphtherie' },
  { value: 'ebvd', label: 'Ebolafieber' },
  { value: 'gfvd', label: 'Gelbfieber' },
  { value: 'husd', label: 'Hämolytisch-urämisches Syndrom (HUS)' },
  { value: 'havd', label: 'Hepatitis A' },
  { value: 'hbvd', label: 'Hepatitis B' },
  { value: 'hcvd', label: 'Hepatitis C' },
  { value: 'msvd', label: 'Masern' },
  { value: 'mbvd', label: 'Meningokokken, invasive Erkrankung' },
  { value: 'mpxd', label: 'Mpox' },
  { value: 'sald', label: 'Salmonellose' },
  { value: 'tbkd', label: 'Tuberkulose' },
  { value: 'wzsd', label: 'Windpocken' },
];

@Component({
  selector: 'app-filterable-select-example-1',
  templateUrl: './example-1.component.html',
  imports: [FormlyModule, ReactiveFormsModule, JsonPipe],
})
export class FilterableSelectExample1Component {
  form = new FormGroup({});
  model: Record<string, any> = {
    disease: undefined,
  };
  fields: FormlyFieldConfig[] = [
    filterableSelectField<SelectOption>({
      id: 'disease',
      key: 'disease',
      label: 'Meldetatbestand',
      required: true,
      options: DISEASE_OPTIONS,
      searchPlaceholder: 'Meldetatbestand suchen...',
    }),
  ];
}
