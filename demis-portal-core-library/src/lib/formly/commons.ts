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

import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

export const formlyInputField = (config: {
  key: string;
  className: string;
  props: FormlyFieldProps;
  validators?: string[];
  id?: string;
}): FormlyFieldConfig => {
  return {
    id: config.id ? config.id : config.key,
    key: config.key,
    className: config.className,
    type: 'input',
    props: config.props,
    validators: {
      validation: config.validators ?? ['textValidator', 'nonBlankValidator'],
    },
  };
};

export const formlyRow = (fieldConfig: FormlyFieldConfig[], key?: string, className: string = FormlyConstants.ROW) => {
  return {
    key: key || undefined,
    fieldGroupClassName: className,
    fieldGroup: fieldConfig,
  } as FormlyFieldConfig;
};

export enum FormlyConstants {
  LAYOUT_FULL_LINE = 'col-md-12 align-self-start',
  LAYOUT_HEADER = 'col-sm-10 mt-sm-3',
  LAYOUT_TEXT = 'col-sm-12 mb-sm-3',
  QUESTIONS_CLASS = 'col-md-12 formly--inline',
  COLMD3 = 'col-md-3',
  COLMD4 = 'col-md-4',
  COLMD5 = 'col-md-5',
  COLMD6 = 'col-md-6',
  COLMD7 = 'col-md-7',
  COLMD8 = 'col-md-8',
  COLMD9 = 'col-md-9',
  COLMD10 = 'col-md-10',
  COLMD11 = 'col-md-11',
  COLMD12 = 'col-md-12',
  COLMD10_INLINE = 'col-md-10 formly--inline',
  COLMD11_INLINE = 'col-md-11 formly--inline',
  COLMD12_INLINE = 'col-md-12 formly--inline',
  ROW = 'row',
}

export type selectOption = { label: string; value: any };

export const GERMANY_COUNTRY_CODE: string = 'DE';
export const TEXT_MAX_LENGTH: number = 100;

//TODO use the open api generated types when possible
export const RESIDENCE_ADDRESS_TYPE_OPTION_LIST = [
  { value: 'primary', label: 'Hauptwohnung' },
  { value: 'ordinary', label: 'Gewöhnlicher Aufenthaltsort' },
];
