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

import { TestBed } from '@angular/core/testing';

import { DatepickerStateService } from './datepicker-state.service';
import { DEFAULT_PRECISION_LEVEL } from '../datepicker-shared';
import { MockBuilder } from 'ng-mocks';
import { signal } from '@angular/core';

describe('DatepickerStateService', () => {
  let service: DatepickerStateService;

  beforeEach(() => {
    return MockBuilder(DatepickerStateService);
  });

  beforeEach(() => {
    service = TestBed.inject(DatepickerStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initSharedState', () => {
    it('if no allowedPrecisions passed as param, use DEFAULT_PRECISION_LEVEL', () => {
      service.initSharedState([], signal(null), signal(null), false);
      expect(service.allowedPrecisions).toEqual(DEFAULT_PRECISION_LEVEL);
    });

    it('should use provided allowedPrecisions when not empty', () => {
      service.initSharedState(['month', 'year'], signal(null), signal(null), false);
      expect(service.allowedPrecisions).toEqual(['month', 'year']);
    });

    it('should store minDate and maxDate signals', () => {
      const minDate = new Date(2020, 0, 1);
      const maxDate = new Date(2025, 11, 31);
      const minDateSignal = signal<Date | null>(minDate);
      const maxDateSignal = signal<Date | null>(maxDate);

      service.initSharedState(['day'], minDateSignal, maxDateSignal, false);

      expect(service.minDate()).toBe(minDate);
      expect(service.maxDate()).toBe(maxDate);
    });

    it('should store multiYear flag', () => {
      service.initSharedState(['year'], signal(null), signal(null), true);
      expect(service.multiYear).toBe(true);

      service.initSharedState(['year'], signal(null), signal(null), false);
      expect(service.multiYear).toBe(false);
    });
  });

  describe('precision management', () => {
    beforeEach(() => {
      service.initSharedState(['day', 'month', 'year'], signal(null), signal(null), false);
    });

    it('should return current precision as read-only signal', () => {
      const precision = service.currentPrecision;
      expect(precision()).toBe('day'); // highest precision available
    });

    it('should update current precision', () => {
      service.setCurrentPrecision('month');
      expect(service.currentPrecision()).toBe('month');

      service.setCurrentPrecision('year');
      expect(service.currentPrecision()).toBe('year');
    });
  });

  describe('highestPrecisionAvailable', () => {
    it('should return DEFAULT_PRECISION_LEVEL[0] when not initialized', () => {
      expect(service.highestPrecisionAvailable).toEqual(DEFAULT_PRECISION_LEVEL[0]);
    });

    it('should return day when day precision is allowed', () => {
      service.initSharedState(['day', 'month', 'year'], signal(null), signal(null), false);
      expect(service.highestPrecisionAvailable).toBe('day');
    });

    it('should return month when month is highest allowed', () => {
      service.initSharedState(['month', 'year'], signal(null), signal(null), false);
      expect(service.highestPrecisionAvailable).toBe('month');
    });

    it('should return year when only year is allowed', () => {
      service.initSharedState(['year'], signal(null), signal(null), false);
      expect(service.highestPrecisionAvailable).toBe('year');
    });
  });
});
