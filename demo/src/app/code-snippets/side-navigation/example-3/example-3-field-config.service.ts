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
      key: 'name',
      type: 'input',
      props: {
        label: 'Name der meldenden Person',
        placeholder: 'z.B. Dr. Max Mustermann',
        required: true,
      },
    },
  ];

  readonly notifiedPersonFields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name der gemeldeten Person',
        placeholder: 'z.B. Erika Musterfrau',
        required: true,
      },
    },
  ];

  readonly diseaseChoiceFields: FormlyFieldConfig[] = [
    {
      key: 'disease',
      type: 'select',
      props: {
        label: 'Krankheit',
        placeholder: 'Krankheit auswählen',
        required: true,
        multiple: false,
        options: [
          { label: '- Keine Auswahl -', value: null },
          { label: 'Erkältung', value: 'Erkältung' },
          { label: 'Andere Krankheit', value: 'Andere Krankheit' },
        ],
      },
    },
  ];

  readonly conditionFields: FormlyFieldConfig[] = [
    {
      key: 'value',
      type: 'input',
      props: {
        label: 'Zustand des Patienten',
        placeholder: 'z.B. Stabil',
        required: true,
      },
      expressions: {
        'props.type': () => {
          const diseaseValue = this.notificationService.diseaseChoiceModel.disease;
          // Hide input field when Erkältung is selected - radio buttons shown via template
          return diseaseValue === 'Erkältung' ? 'hidden' : 'input';
        },
      },
    },
  ];

  readonly conditionRadioFields: FormlyFieldConfig[] = [
    {
      key: 'value',
      type: 'radio',
      props: {
        label: 'Männerschnupfen?',
        required: true,
        options: [
          { label: 'Ja', value: 'Ja' },
          { label: 'Nein', value: 'Nein' },
        ],
      },
    },
  ];

  readonly commonDataFields: FormlyFieldConfig[] = [
    {
      key: 'info',
      type: 'input',
      props: {
        label: 'Zusätzliche Informationen',
        placeholder: 'z.B. Kontaktinformationen',
        required: true,
      },
    },
  ];

  readonly questionnaireFields: FormlyFieldConfig[] = [
    {
      key: 'answer',
      type: 'input',
      props: {
        label: 'Fragebogen-Antwort',
        placeholder: 'z.B. Weitere Angaben',
        required: true,
      },
    },
  ];
}
