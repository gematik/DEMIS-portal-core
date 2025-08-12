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
import { isValid, parseISO } from 'date-fns';
import { FormControl } from '@angular/forms';

export type DatePrecision = 'day' | 'month' | 'year';
export type SupportedDateFormat = 'ISO' | 'GERMAN';
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

export function precisionToView(precision: DatePrecision): MatCalendarView {
  switch (precision) {
    case 'day':
      return 'month';
    case 'month':
      return 'year';
    case 'year':
      return 'multi-year';
  }
}

export function detectPrecisionFromDateInGermanFormat(input: string): DatePrecision | null {
  const trimmed = input?.trim?.();
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
  if (!isValid(parseISO(isoString))) {
    return null;
  }

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

function parseGermanDate(input: any, precision: DatePrecision): string[] | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove whitespace and check for dot-separated format
  const cleaned = input.trim();
  let parts: string[] = [];

  if (cleaned.includes('.')) {
    // Split by dots if present
    parts = cleaned.split('.').filter(Boolean);
  } else {
    // If no dots: try to parse based on expected length
    switch (precision) {
      case 'day':
        if (cleaned.length === 8) {
          parts = [cleaned.slice(0, 2), cleaned.slice(2, 4), cleaned.slice(4)];
        }
        break;
      case 'month':
        if (cleaned.length === 6) {
          parts = [cleaned.slice(0, 2), cleaned.slice(2)];
        }
        break;
    }
  }

  return parts;
}

function convertGermanDateToISOWithPrecision(value: any, precision: DatePrecision): string | null {
  const dateParts = parseGermanDate(value, precision);

  if (!dateParts) {
    return null;
  }

  switch (precision) {
    case 'day':
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      break;

    case 'month':
      if (dateParts.length === 2) {
        const [month, year] = dateParts;
        return `${year}-${month.padStart(2, '0')}`;
      }
      break;
  }

  return null; // Invalid format
}

export function determinePrecisionAndFormat(value: string): { precision: DatePrecision | null; format: SupportedDateFormat } {
  let precision: DatePrecision | null = null;

  precision = detectPrecisionFromDateInGermanFormat(value);

  if (precision) {
    return { precision, format: 'GERMAN' };
  }

  return { precision: detectPrecisionFromIso(value), format: 'ISO' };
}

export function convertNonIsoFormats(formControl: FormControl, newValue: string, precision: DatePrecision, format: SupportedDateFormat) {
  if (precision === 'year') {
    return;
  }

  if (format === 'GERMAN') {
    const converted = convertGermanDateToISOWithPrecision(newValue, precision);
    if (converted !== newValue) {
      formControl.setValue(converted);
    }
  }
}
