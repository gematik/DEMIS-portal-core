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

import { detectPrecisionFromDateGermanFormat, detectPrecisionFromIso } from './datepicker-shared';

describe('datepicker-shared', () => {
  describe('detectPrecisionFromDateGermanFormat', () => {
    it('should detect year format', () => {
      expect(detectPrecisionFromDateGermanFormat('2025')).toBe('year');
    });

    it('should detect month format with dot', () => {
      expect(detectPrecisionFromDateGermanFormat('05.2025')).toBe('month');
    });

    it('should detect month format without dot', () => {
      expect(detectPrecisionFromDateGermanFormat('052025')).toBe('month');
    });

    it('should detect day format with dots', () => {
      expect(detectPrecisionFromDateGermanFormat('15.05.2025')).toBe('day');
    });

    it('should detect day format without dots', () => {
      expect(detectPrecisionFromDateGermanFormat('15052025')).toBe('day');
    });

    it('should return null for invalid input', () => {
      expect(detectPrecisionFromDateGermanFormat('')).toBeNull();
      expect(detectPrecisionFromDateGermanFormat('2025-05')).toBeNull();
      expect(detectPrecisionFromDateGermanFormat('random')).toBeNull();
    });
  });

  describe('detectPrecisionFromIso', () => {
    it('should detect year precision', () => {
      expect(detectPrecisionFromIso('2025')).toBe('year');
    });

    it('should detect month precision', () => {
      expect(detectPrecisionFromIso('2025-02')).toBe('month');
    });

    it('should detect day precision', () => {
      expect(detectPrecisionFromIso('2025-02-15')).toBe('day');
    });

    it('should return null for malformed ISO strings', () => {
      expect(detectPrecisionFromIso('202502')).toBeNull();
      expect(detectPrecisionFromIso('2025.02')).toBeNull();
      expect(detectPrecisionFromIso('')).toBeNull();
      expect(detectPrecisionFromIso('15.05.2025')).toBeNull();
    });
  });
});
