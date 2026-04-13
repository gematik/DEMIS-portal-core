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

import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NotificationService } from './example-3-notification.service';

/**
 * Service providing Formly field configurations for all form steps.
 * Centralizes field configuration management and keeps components clean.
 */
@Injectable()
export class FieldConfigService {
  private readonly notificationService = inject(NotificationService);

  readonly notifyingPersonFields: FormlyFieldConfig[] = [
    {
      key: 'given',
      type: 'input',
      props: {
        label: 'Vorname (N.given)',
        placeholder: 'e.g. Max',
        required: true,
      },
    },
    {
      key: 'family',
      type: 'input',
      props: {
        label: 'Nachname (N.family)',
        placeholder: 'e.g. Mustermann',
        required: true,
      },
    },
  ];

  readonly notifiedPersonFields: FormlyFieldConfig[] = [
    {
      key: 'given',
      type: 'input',
      props: {
        label: 'Vorname (P.given)',
        placeholder: 'e.g. Erika',
        required: true,
      },
    },
    {
      key: 'family',
      type: 'input',
      props: {
        label: 'Nachname (P.family)',
        placeholder: 'e.g. Musterfrau',
        required: true,
      },
    },
  ];

  readonly diseaseChoiceFields: FormlyFieldConfig[] = [
    {
      key: 'code',
      type: 'select',
      props: {
        label: 'Meldetatbestand (D.code)',
        placeholder: 'Meldetatbestand auswählen',
        required: true,
        multiple: false,
        options: [
          { label: '- Keine Auswahl -', value: null },
          { label: 'COVID-19 (cvdd)', value: 'cvdd' },
          { label: 'Masern (msvd)', value: 'msvd' },
        ],
      },
    },
  ];

  readonly conditionFields: FormlyFieldConfig[] = [
    {
      key: 'status',
      type: 'input',
      props: {
        label: 'Meldungsstatus (D.status)',
        placeholder: 'e.g. final, preliminary',
        required: true,
      },
      expressions: {
        'props.type': () => {
          const diseaseValue = this.notificationService.diseaseChoiceModel.code;
          // Show radio buttons for COVID-19, text input for other diseases
          return diseaseValue === 'cvdd' ? 'hidden' : 'input';
        },
      },
    },
  ];

  readonly conditionRadioFields: FormlyFieldConfig[] = [
    {
      key: 'status',
      type: 'radio',
      props: {
        label: 'Meldungsstatus (D.status)',
        required: true,
        options: [
          { label: 'Endgültig (final)', value: 'final' },
          { label: 'Vorläufig (preliminary)', value: 'preliminary' },
        ],
      },
    },
  ];

  readonly commonDataFields: FormlyFieldConfig[] = [
    {
      key: 'importantInfo',
      type: 'input',
      props: {
        label: 'Wichtige Zusatzinformationen (C.importantInfo)',
        placeholder: 'e.g. Kontaktperson identifiziert',
        required: true,
      },
    },
  ];

  readonly questionnaireFields: FormlyFieldConfig[] = [
    {
      key: 'hospitalized',
      type: 'input',
      props: {
        label: 'Hospitalisierung (C.hospitalized)',
        placeholder: 'e.g. yes, no, noInformation',
        required: true,
      },
    },
  ];
}
