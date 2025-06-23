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

import { cloneObject } from './clone-object.function';

describe('Utils - cloneObject', () => {
  it('should clone an object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.b).toEqual(obj.b);
    expect(clonedObj.b).not.toBe(obj.b);
  });

  it('should clone an array', () => {
    const arr = [1, 2, { a: 3 }];
    const clonedArr = cloneObject(arr);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr[2]).not.toBe(arr[2]);
  });

  it('should return the same value for non-object types', () => {
    expect(cloneObject(1)).toBe(1);
    expect(cloneObject('string')).toBe('string');
    expect(cloneObject(null)).toBe(null);
    expect(cloneObject(undefined)).toBe(undefined);
  });

  it('should handle nested objects and arrays', () => {
    const obj = { a: [1, 2, { b: 3 }], c: { d: 4 } };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj.a).not.toBe(obj.a);
    expect(clonedObj.a[2]).not.toBe(obj.a[2]);
    expect(clonedObj.c).not.toBe(obj.c);
  });

  it('should handle empty objects and arrays', () => {
    const obj = {};
    const arr: any[] = [];
    expect(cloneObject(obj)).toEqual(obj);
    expect(cloneObject(arr)).toEqual(arr);
  });
});
