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

import { trimStrings } from './trim-strings.function';

describe('Utils - trimStrings', () => {
  it('should trim string values in a flat object', () => {
    const input = { name: ' John ', age: 30, city: ' New York ' };
    const expected = { name: 'John', age: 30, city: 'New York' };
    expect(trimStrings(input)).toEqual(expected);
  });

  it('should trim string values in a nested object', () => {
    const input = { person: { name: ' John ', address: { city: ' New York ' } } };
    const expected = { person: { name: 'John', address: { city: 'New York' } } };
    expect(trimStrings(input)).toEqual(expected);
  });

  it('should trim string values in an array', () => {
    const input = [' John ', ' New York '];
    const expected = ['John', 'New York'];
    expect(trimStrings(input)).toEqual(expected);
  });

  it('should trim string values in a nested array', () => {
    const input = { people: [{ name: ' John ' }, { name: ' Jane ' }] };
    const expected = { people: [{ name: 'John' }, { name: 'Jane' }] };
    expect(trimStrings(input)).toEqual(expected);
  });

  it('should handle non-string values correctly', () => {
    const input = { name: ' John ', age: 30, active: true };
    const expected = { name: 'John', age: 30, active: true };
    expect(trimStrings(input)).toEqual(expected);
  });

  it('should return the same value for non-object and non-array inputs', () => {
    expect(trimStrings(' John ')).toBe('John');
    expect(trimStrings(123)).toBe(123);
    expect(trimStrings(true)).toBe(true);
  });

  it('should handle null and undefined values correctly', () => {
    expect(trimStrings(null)).toBeNull();
    expect(trimStrings(undefined)).toBeUndefined();
  });
});
