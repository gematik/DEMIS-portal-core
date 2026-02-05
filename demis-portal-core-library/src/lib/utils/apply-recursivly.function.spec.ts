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

import { applyRecursivly } from './apply-recursivly.function';

describe('Utils - applyRecursivly', () => {
  it('should apply callback to a primitive value', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly(5, callback);
    expect(result).toBe(10);
    expect(callback).toHaveBeenCalledWith(5);
  });

  it('should apply callback to each element in an array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly([1, 2, 3], callback);
    expect(result).toEqual([2, 4, 6]);
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
  });

  it('should apply callback to each property in an object', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly({ a: 1, b: 2, c: 3 }, callback);
    expect(result).toEqual({ a: 2, b: 4, c: 6 });
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
  });

  it('should apply callback recursively to nested objects', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly({ a: { b: 2 }, c: 3 }, callback);
    expect(result).toEqual({ a: { b: 4 }, c: 6 });
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
  });

  it('should apply callback recursively to nested arrays', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly([1, [2, 3]], callback);
    expect(result).toEqual([2, [4, 6]]);
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
  });

  it('should handle mixed nested structures', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const result = applyRecursivly({ a: [1, { b: 2 }], c: 3 }, callback);
    expect(result).toEqual({ a: [2, { b: 4 }], c: 6 });
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
  });
});
