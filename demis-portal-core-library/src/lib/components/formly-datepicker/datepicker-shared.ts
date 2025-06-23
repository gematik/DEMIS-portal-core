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

import { FormlyFieldProps } from '@ngx-formly/core';
import { MatCalendarView } from '@angular/material/datepicker';

export type DatePrecision = 'day' | 'month' | 'year';
export const DEFAULT_PRECISION_LEVEL: DatePrecision = 'day';

export interface DatepickerCustomProps extends FormlyFieldProps {
  allowedPrecisions?: DatePrecision[];
  minDate?: Date;
  maxDate?: Date;
  multiYear?: boolean;
}

export interface Formats {
  input: string;
  model: string;
  display: string;
}

export enum NavigationDirection {
  PAST = -1,
  FUTURE = 1,
}

export const VALID_FORMATS: Map<DatePrecision, Formats> = new Map([
  ['day', { input: 'dd.MM.yyyy', model: 'yyyy-MM-dd', display: 'TT.MM.JJJJ' }],
  ['month', { input: 'MM.yyyy', model: 'yyyy-MM', display: 'MM.JJJJ' }],
  ['year', { input: 'yyyy', model: 'yyyy', display: 'JJJJ' }],
]);

export const YEARS_PER_PAGE = 24;

export function precisionToView(precision: DatePrecision, multiYearMode: boolean): MatCalendarView {
  if (multiYearMode) {
    return 'multi-year';
  } else {
    switch (precision) {
      case 'day':
        return 'month';
      case 'month':
        return 'year';
      case 'year':
        return 'multi-year';
    }
  }
}

export function detectPrecisionFromDateGermanFormat(input: string): DatePrecision | null {
  const trimmed = input.trim();
  // Matches only year: e.g. "2025"
  if (/^\d{4}$/.test(trimmed)) {
    return 'year';
  }
  // Matches month precision: e.g. "05.2025" or "052025"
  if (/^(?:\d{2}\.\d{4}|\d{6})$/.test(trimmed)) {
    return 'month';
  }
  // Matches day precision: e.g. "15.05.2025" or "15052025"
  if (/^(?:\d{2}\.\d{2}\.\d{4}|\d{8})$/.test(trimmed)) {
    return 'day';
  }
  return null;
}

export function detectPrecisionFromIso(isoString: string): DatePrecision | null {
  // Matches only year: e.g. "2025"
  if (/^\d{4}$/.test(isoString)) {
    return 'year';
  }
  // Matches month precision: e.g. "2025-05"
  if (/^\d{4}-\d{2}$/.test(isoString)) {
    return 'month';
  }
  // Matches day precision: e.g. "2025-05-15"
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    return 'day';
  }
  return null;
}
