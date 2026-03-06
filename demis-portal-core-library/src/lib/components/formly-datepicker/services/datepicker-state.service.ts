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
  private _allowedPrecisions!: DatePrecision[];
  private _currentPrecision!: WritableSignal<DatePrecision>;
  private _minDate!: Signal<Date | null>;
  private _maxDate!: Signal<Date | null>;
  private _multiYear!: boolean;

  initSharedState(allowedPrecisions: DatePrecision[], minDate: Signal<Date | null>, maxDate: Signal<Date | null>, multiYear: boolean) {
    this._allowedPrecisions = allowedPrecisions.length > 0 ? allowedPrecisions : DEFAULT_PRECISION_LEVEL;
    this._currentPrecision = signal(this.highestPrecisionAvailable);
    this._minDate = minDate;
    this._maxDate = maxDate;
    this._multiYear = multiYear;
  }

  get allowedPrecisions(): DatePrecision[] {
    return this._allowedPrecisions;
  }

  get minDate(): Signal<Date | null> {
    return this._minDate;
  }

  get maxDate(): Signal<Date | null> {
    return this._maxDate;
  }

  get multiYear(): boolean {
    return this._multiYear;
  }

  get currentPrecision(): Signal<DatePrecision> {
    return this._currentPrecision.asReadonly();
  }

  setCurrentPrecision(precision: DatePrecision) {
    this._currentPrecision.set(precision);
  }

  get highestPrecisionAvailable(): DatePrecision {
    const priority: DatePrecision[] = ['day', 'month', 'year'];
    for (const precision of priority) {
      if (this.allowedPrecisions?.includes(precision)) {
        return precision;
      }
    }
    return DEFAULT_PRECISION_LEVEL[0];
  }
}
