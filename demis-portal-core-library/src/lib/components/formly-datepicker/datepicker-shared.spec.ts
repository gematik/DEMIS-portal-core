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

import {
  detectPrecisionFromDateInGermanFormat,
  detectPrecisionFromIso,
  precisionToView,
  determinePrecisionAndFormat,
  convertNonIsoFormats,
  VALID_FORMATS,
  DEFAULT_PRECISION_LEVEL,
  DatePrecision,
} from './datepicker-shared';
import { FormControl } from '@angular/forms';

describe('datepicker-shared', () => {
  describe('detectPrecisionFromDateGermanFormat', () => {
    const testCases: Array<{
      input: any;
      expected: DatePrecision | null;
      description: string;
    }> = [
      // Valid formats
      { input: '2025', expected: 'year', description: 'year format' },
      { input: '05.2025', expected: 'month', description: 'month format with dot' },
      { input: '052025', expected: 'month', description: 'month format without dot' },
      { input: '15.05.2025', expected: 'day', description: 'day format with dots' },
      { input: '15052025', expected: 'day', description: 'day format without dots' },
      // Edge cases with whitespace
      { input: '  2025  ', expected: 'year', description: 'year with whitespace' },
      { input: '  05.2025  ', expected: 'month', description: 'month with whitespace' },
      { input: '  15.05.2025  ', expected: 'day', description: 'day with whitespace' },
      // Invalid formats
      { input: '', expected: null, description: 'empty string' },
      { input: '2025-05', expected: null, description: 'ISO format' },
      { input: 'random', expected: null, description: 'random text' },
      { input: '   ', expected: null, description: 'whitespace only' },
      { input: null, expected: null, description: 'null input' },
      { input: undefined, expected: null, description: 'undefined input' },
      { input: {}, expected: null, description: 'object without trim method' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should handle ${description}`, () => {
        expect(detectPrecisionFromDateInGermanFormat(input)).toBe(expected);
      });
    });
  });

  describe('detectPrecisionFromIso', () => {
    const testCases: Array<{
      input: string;
      expected: DatePrecision | null;
      description: string;
    }> = [
      // Valid ISO formats
      { input: '2025', expected: 'year', description: 'year precision' },
      { input: '2025-02', expected: 'month', description: 'month precision' },
      { input: '2025-02-15', expected: 'day', description: 'day precision' },
      // Malformed ISO strings
      { input: '202502', expected: null, description: 'malformed year-month' },
      { input: '2025.02', expected: null, description: 'dots instead of dashes' },
      { input: '', expected: null, description: 'empty string' },
      { input: '15.05.2025', expected: null, description: 'German format' },
      // Invalid dates
      { input: '2025-02-31', expected: null, description: 'invalid day (Feb 31)' },
      { input: '2025-13', expected: null, description: 'invalid month (13)' },
      { input: '9999-00', expected: null, description: 'invalid month (00)' },
      { input: 'foo', expected: null, description: 'non-date string' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should handle ${description}`, () => {
        expect(detectPrecisionFromIso(input)).toBe(expected);
      });
    });
  });

  describe('precisionToView', () => {
    it('should return correct view for day precision', () => {
      expect(precisionToView('day')).toBe('month');
    });

    it('should return correct view for month precision', () => {
      expect(precisionToView('month')).toBe('year');
    });

    it('should return correct view for year precision', () => {
      expect(precisionToView('year')).toBe('multi-year');
    });
  });

  describe('determinePrecisionAndFormat', () => {
    const testCases: Array<{
      input: string;
      expectedPrecision: DatePrecision | null;
      expectedFormat: 'GERMAN' | 'ISO';
    }> = [
      // German formats
      { input: '15.05.2025', expectedPrecision: 'day', expectedFormat: 'GERMAN' },
      { input: '05.2025', expectedPrecision: 'month', expectedFormat: 'GERMAN' },
      { input: '2025', expectedPrecision: 'year', expectedFormat: 'GERMAN' },
      // ISO formats
      { input: '2025-05-15', expectedPrecision: 'day', expectedFormat: 'ISO' },
      { input: '2025-05', expectedPrecision: 'month', expectedFormat: 'ISO' },
      // Invalid format
      { input: 'invalid-date', expectedPrecision: null, expectedFormat: 'ISO' },
    ];

    testCases.forEach(({ input, expectedPrecision, expectedFormat }) => {
      it(`should detect ${expectedFormat} format for input "${input}"`, () => {
        const result = determinePrecisionAndFormat(input);
        expect(result.precision).toBe(expectedPrecision);
        expect(result.format).toBe(expectedFormat);
      });
    });
  });

  describe('convertNonIsoFormats', () => {
    let formControl: FormControl;
    let setValueSpy: jasmine.Spy;

    beforeEach(() => {
      formControl = new FormControl();
      setValueSpy = spyOn(formControl, 'setValue');
    });

    it('should convert German formats to ISO', () => {
      // Day format with dots
      convertNonIsoFormats(formControl, '15.05.2025', 'day', 'GERMAN');
      expect(setValueSpy).toHaveBeenCalledWith('2025-05-15');

      // Month format with dot
      setValueSpy.calls.reset();
      convertNonIsoFormats(formControl, '05.2025', 'month', 'GERMAN');
      expect(setValueSpy).toHaveBeenCalledWith('2025-05');

      // Day format without dots
      setValueSpy.calls.reset();
      convertNonIsoFormats(formControl, '15052025', 'day', 'GERMAN');
      expect(setValueSpy).toHaveBeenCalledWith('2025-05-15');

      // Month format without dot
      setValueSpy.calls.reset();
      convertNonIsoFormats(formControl, '052025', 'month', 'GERMAN');
      expect(setValueSpy).toHaveBeenCalledWith('2025-05');
    });

    it('should not convert when no conversion needed', () => {
      // Year precision (early return)
      convertNonIsoFormats(formControl, '2025', 'year', 'GERMAN');
      expect(setValueSpy).not.toHaveBeenCalled();

      // ISO format
      setValueSpy.calls.reset();
      convertNonIsoFormats(formControl, '2025-05-15', 'day', 'ISO');
      expect(setValueSpy).not.toHaveBeenCalled();

      // Null input
      setValueSpy.calls.reset();
      convertNonIsoFormats(formControl, null as any, 'day', 'GERMAN');
      expect(setValueSpy).not.toHaveBeenCalled();
    });

    it('should handle invalid inputs with null conversion', () => {
      const testCases: Array<{ input: any; precision: DatePrecision }> = [
        { input: 'invalid-date', precision: 'day' },
        { input: '', precision: 'day' },
        { input: 123, precision: 'day' },
        { input: '15.05', precision: 'day' },
        { input: '05', precision: 'month' },
        { input: '1505202', precision: 'day' },
        { input: '05202', precision: 'month' },
        // Test month precision with invalid inputs
        { input: 'invalid-date', precision: 'month' },
        { input: '', precision: 'month' },
        { input: 123, precision: 'month' },
      ];

      testCases.forEach(({ input, precision }) => {
        setValueSpy.calls.reset();
        convertNonIsoFormats(formControl, input, precision, 'GERMAN');
        expect(setValueSpy).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('VALID_FORMATS constant', () => {
    it('should contain correct formats for day precision', () => {
      const dayFormat = VALID_FORMATS.get('day');
      expect(dayFormat).toEqual({
        input: 'dd.MM.yyyy',
        model: 'yyyy-MM-dd',
        display: 'TT.MM.JJJJ',
      });
    });

    it('should contain correct formats for month precision', () => {
      const monthFormat = VALID_FORMATS.get('month');
      expect(monthFormat).toEqual({
        input: 'MM.yyyy',
        model: 'yyyy-MM',
        display: 'MM.JJJJ',
      });
    });

    it('should contain correct formats for year precision', () => {
      const yearFormat = VALID_FORMATS.get('year');
      expect(yearFormat).toEqual({
        input: 'yyyy',
        model: 'yyyy',
        display: 'JJJJ',
      });
    });
  });

  describe('DEFAULT_PRECISION_LEVEL constant', () => {
    it('should be set to day', () => {
      expect(DEFAULT_PRECISION_LEVEL).toBe('day');
    });
  });
});
