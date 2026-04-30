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
  selector: 'app-filterable-select-example-3',
  templateUrl: './example-3.component.html',
  imports: [FormlyModule, ReactiveFormsModule, JsonPipe],
})
export class FilterableSelectExample3Component {
  form = new FormGroup({});
  model: Record<string, any> = {
    pathogen: undefined,
  };
  fields: FormlyFieldConfig[] = [
    {
      id: 'pathogen',
      key: 'pathogen',
      type: 'filterable-select',
      props: {
        label: 'Erreger (mit Wert)',
        required: true,
        showValue: true,
        clearable: true,
        options: [
          { value: '840533007', label: 'SARS-CoV-2', description: 'Virus > Coronavirus' },
          { value: '407479009', label: 'Influenza A', description: 'Virus > Orthomyxovirus' },
          { value: '407480007', label: 'Influenza B', description: 'Virus > Orthomyxovirus' },
          { value: '84101006', label: 'Norovirus', description: 'Virus > Calicivirus' },
          { value: '302811003', label: 'Salmonellen', description: 'Bakterien > Enterobacteriaceae' },
          { value: '112283007', label: 'Escherichia coli', description: 'Bakterien > Enterobacteriaceae' },
          { value: '113861009', label: 'Campylobacter', description: 'Bakterien > Campylobacteraceae' },
          { value: '5851001', label: 'Mycobacterium tuberculosis', description: 'Bakterien > Mycobacteriaceae' },
        ],
        searchPlaceholder: 'Nach Name oder Wert suchen...',
        noEntriesFoundLabel: 'Kein Erreger gefunden',
      },
    },
  ];
}
