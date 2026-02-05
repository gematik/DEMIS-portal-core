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

import { FormControl } from '@angular/forms';
import { ProcessStep } from '@gematik/demis-portal-core-library';

export function getStepData(): ProcessStep[] {
  return [
    { key: 'step-1', label: 'Step 1', control: new FormControl() },
    { key: 'step-2', label: 'Step 2', control: new FormControl() },
    { key: 'step-3', label: 'Step 3', control: new FormControl() },
    { key: 'step-4', label: 'Step 4', control: new FormControl() },
    { key: 'step-5', label: 'Step 5', control: new FormControl() },
    { key: 'step-6', label: 'Step 6', control: new FormControl() },
  ];
}
