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

import { FormControl, Validators } from '@angular/forms';
import { ProcessStep } from '@gematik/demis-portal-core-library';

export const stepData: ProcessStep[] = [
  {
    key: 'provide-meta-data',
    label: 'Metadaten bereitstellen',
    description: 'Bereitstellung der Metadaten in tabellarischer Form',
    control: new FormControl('', { validators: [Validators.required] }),
  },
  {
    key: 'select-sequence-files',
    label: 'Sequenzdateien auswählen',
    description: 'Bereitstellung der zugehörigen Sequenzdateien',
    // With the control initialization here, we ensure, that the step is disabled at startup
    control: new FormControl({ value: '', disabled: true }, { validators: [Validators.required] }),
  },
  {
    key: 'upload-status',
    label: 'Status des Uploads',
    description: 'Hochladen der Sequenzdateien und Übermittlung an das RKI',
    // With the control initialization here, we ensure, that the step is disabled at startup
    control: new FormControl({ value: '', disabled: true }, { validators: [Validators.required] }),
  },
  {
    key: 'result',
    label: 'Ergebnis',
    description: 'Zusammenfassung der Übermittlungen',
    // With the control initialization here, we ensure, that the step is disabled at startup
    control: new FormControl({ value: '', disabled: true }, { validators: [Validators.required] }),
  },
];
