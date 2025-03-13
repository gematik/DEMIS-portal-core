/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { trimStringValue } from './trim-string-value.function';

describe('Utils - trimStringValue', () => {
  it('should trim a string value', () => {
    expect(trimStringValue('  hello  ')).toBe('hello');
  });

  it('should return the same value if it is not a string', () => {
    expect(trimStringValue(123)).toBe(123);
    expect(trimStringValue(true)).toBe(true);
    expect(trimStringValue(null)).toBe(null);
    expect(trimStringValue(undefined)).toBe(undefined);
    expect(trimStringValue({})).toEqual({});
  });

  it('should return an empty string if the input is an empty string', () => {
    expect(trimStringValue('')).toBe('');
  });

  it('should trim a string with only spaces', () => {
    expect(trimStringValue('   ')).toBe('');
  });

  it('should return the same string if there are no spaces to trim', () => {
    expect(trimStringValue('hello')).toBe('hello');
  });
});
