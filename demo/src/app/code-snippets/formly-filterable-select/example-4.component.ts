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
import { filterableSelectField } from '@gematik/demis-portal-core-library';

// Domain-specific type — e.g. from an API or shared types module
interface FacilityType {
  code: string;
  display: string;
  system: string;
  category?: string;
}

const FACILITY_TYPES: FacilityType[] = [
  { code: 'KH', display: 'Krankenhaus', system: 'urn:facility', category: 'Stationär' },
  { code: 'AP', display: 'Arztpraxis', system: 'urn:facility', category: 'Ambulant' },
  { code: 'LA', display: 'Labor', system: 'urn:facility', category: 'Diagnostik' },
  { code: 'PH', display: 'Apotheke', system: 'urn:facility', category: 'Versorgung' },
  { code: 'GA', display: 'Gesundheitsamt', system: 'urn:facility', category: 'Behörde' },
  { code: 'RV', display: 'Rehabilitationseinrichtung', system: 'urn:facility', category: 'Stationär' },
  { code: 'PD', display: 'Pflegedienst', system: 'urn:facility', category: 'Ambulant' },
  { code: 'PH', display: 'Pflegeheim', system: 'urn:facility', category: 'Stationär' },
];

@Component({
  selector: 'app-filterable-select-example-4',
  templateUrl: './example-4.component.html',
  imports: [FormlyModule, ReactiveFormsModule, JsonPipe],
})
export class FilterableSelectExample4Component {
  form = new FormGroup({});
  model: Record<string, any> = {
    facility: undefined,
  };

  // Type-safe builder: TypeScript enforces optionValueKey & optionLabelKey for non-SelectOption types,
  // validates keys against FacilityType, and provides editor autocompletion.
  fields: FormlyFieldConfig[] = [
    filterableSelectField<FacilityType>({
      id: 'facility',
      key: 'facility',
      label: 'Einrichtungstyp',
      required: true,
      showValue: true,
      options: FACILITY_TYPES,
      optionValueKey: 'code',
      optionLabelKey: 'display',
      optionDescriptionKey: 'category',
      searchPlaceholder: 'Einrichtung suchen...',
    }),
  ];
}
