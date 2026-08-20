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

const DISEASE_OPTIONS: SelectOption[] = [{ value: 'clod', label: 'Botulismus' }];

@Component({
  selector: 'app-filterable-select-example-5',
  templateUrl: './example-5.component.html',
  imports: [FormlyModule, ReactiveFormsModule, JsonPipe],
})
export class FilterableSelectExample5Component {
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
  protected readonly DISEASE_OPTIONS = DISEASE_OPTIONS;
}
