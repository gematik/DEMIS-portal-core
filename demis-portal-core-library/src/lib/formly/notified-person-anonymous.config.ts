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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyConstants, formlyInputField, formlyRow, GERMANY_COUNTRY_CODE, selectOption } from './commons';

export const notifiedPersonAnonymousConfigFields = (countryOptionList: selectOption[], genderOptionList: selectOption[]): FormlyFieldConfig[] => {
  return [
    formlyRow([
      {
        className: FormlyConstants.COLMD10,
        template: `
      <div class="info-notification-text">
        <span class="material-icons md-48 primary-color-icon">info_outline</span>
          <span class="message">Grundsätzlich müssen Sie gemäß Infektionsschutzgesetz alle Ihnen vorliegenden Informationen im Meldeformular angeben, um die Meldepflicht zu erfüllen. Die Nachmeldung oder Korrektur von Angaben hat unverzüglich zu erfolgen.</span>
         </div>
    `,
        key: 'notifiedPersonInfoWrapper',
      },
      {
        className: '',
        template: '<h2>Allgemein</h2>',
      },
      {
        id: 'gender',
        key: 'info.gender',
        type: 'select',
        className: FormlyConstants.COLMD5,
        props: {
          label: 'Geschlecht',
          options: genderOptionList,
        },
      },
      {
        id: 'birthDate',
        key: 'info.birthDate',
        className: FormlyConstants.COLMD5,
        type: 'datepicker',
        wrappers: [],
        props: {
          label: 'Geburtsdatum',
          allowedPrecisions: ['month', 'year'],
          required: false,
          minDate: new Date('1870-01-01'),
          maxDate: new Date(),
          multiYear: true,
        },
      },
      {
        className: '',
        template: '<h2>Wohnsitz</h2>',
      },
      {
        id: 'residence-address-country',
        key: 'residenceAddress.country',
        className: FormlyConstants.COLMD10,
        type: 'select',
        defaultValue: GERMANY_COUNTRY_CODE,
        props: {
          label: 'Land',
          options: countryOptionList,
        },
      },
      {
        className: '',
        template: '<h3>Erste drei Ziffern der Postleitzahl (Deutschland) der untersuchten Person</h3>',
      },
      formlyInputField({
        id: 'residence-address-zip',
        key: 'residenceAddress.zip',
        className: FormlyConstants.COLMD10,
        props: {
          maxLength: 3,
          label: 'Postleitzahl',
        },
        validators: ['germanShortZipValidator'],
      }),
    ]),
  ];
};
