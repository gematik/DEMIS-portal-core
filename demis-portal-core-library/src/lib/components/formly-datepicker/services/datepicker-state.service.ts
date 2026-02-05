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

import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { DatePrecision, DEFAULT_PRECISION_LEVEL } from '../datepicker-shared';

/**
 * Service to manage the state of a datepicker, required for the communication with the header.
 */
@Injectable()
export class DatepickerStateService {
  private allowedPrecisions!: DatePrecision[];
  private currentPrecision!: WritableSignal<DatePrecision>;
  private minDate!: Signal<Date | null>;
  private maxDate!: Signal<Date | null>;
  private multiYear!: boolean;

  initSharedState(allowedPrecisions: DatePrecision[], minDate: Signal<Date | null>, maxDate: Signal<Date | null>, multiYear: boolean) {
    this.allowedPrecisions = allowedPrecisions.length > 0 ? allowedPrecisions : [DEFAULT_PRECISION_LEVEL];
    this.currentPrecision = signal(this.getHighestPrecisionAvailable());
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.multiYear = multiYear;
  }

  getAllowedPrecisions(): DatePrecision[] {
    return this.allowedPrecisions;
  }

  getMinDate(): Signal<Date | null> {
    return this.minDate;
  }

  getMaxDate(): Signal<Date | null> {
    return this.maxDate;
  }

  isMultiYear(): boolean {
    return this.multiYear;
  }

  getCurrentPrecision(): Signal<DatePrecision> {
    return this.currentPrecision.asReadonly();
  }

  setCurrentPrecision(precision: DatePrecision) {
    this.currentPrecision.set(precision);
  }

  getHighestPrecisionAvailable(): DatePrecision {
    const priority: DatePrecision[] = ['day', 'month', 'year'];
    for (const precision of priority) {
      if (this.getAllowedPrecisions()?.includes(precision)) {
        return precision;
      }
    }
    return DEFAULT_PRECISION_LEVEL;
  }
}
