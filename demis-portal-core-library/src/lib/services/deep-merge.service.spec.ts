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
import { MockBuilder } from 'ng-mocks';

import { DeepMergeService } from './deep-merge.service';

describe('DeepMergeService', () => {
  beforeEach(() => MockBuilder(DeepMergeService));

  let service: DeepMergeService;

  beforeEach(() => {
    service = TestBed.inject(DeepMergeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('deepMerge', () => {
    it('should return source when target is null', () => {
      const source = { a: 1 };
      expect(service.deepMerge(null as any, source)).toBe(source);
    });

    it('should return source when target is undefined', () => {
      const source = { a: 1 };
      expect(service.deepMerge(undefined as any, source)).toBe(source);
    });

    it('should return target when source is null', () => {
      const target = { a: 1 };
      expect(service.deepMerge(target, null as any)).toBe(target);
    });

    it('should return target when source is undefined', () => {
      const target = { a: 1 };
      expect(service.deepMerge(target, undefined as any)).toBe(target);
    });

    it('should merge flat properties from source into target', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 20, c: 3 } as any;
      expect(service.deepMerge(target, source)).toEqual({ a: 1, b: 20, c: 3 } as any);
    });

    it('should not mutate the original target object', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 20 };
      const result = service.deepMerge(target, source);
      expect(target).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(target);
    });

    it('should skip undefined values in source', () => {
      const target = { a: 1, b: 2 };
      const source = { a: undefined, b: 20 } as any;
      expect(service.deepMerge(target, source)).toEqual({ a: 1, b: 20 });
    });

    it('should override target values with null from source', () => {
      const target = { a: 1, b: 2 };
      const source = { a: null } as any;
      expect(service.deepMerge(target, source)).toEqual({ a: null, b: 2 } as any);
    });

    it('should deep merge nested objects', () => {
      const target = { nested: { a: 1, b: 2 }, x: 10 };
      const source = { nested: { b: 20, c: 3 } } as any;
      expect(service.deepMerge(target, source)).toEqual({
        nested: { a: 1, b: 20, c: 3 },
        x: 10,
      } as any);
    });

    it('should merge deeply nested objects recursively', () => {
      const target = { level1: { level2: { level3: { a: 1, b: 2 } } } };
      const source = { level1: { level2: { level3: { b: 20, c: 3 } } } } as any;
      expect(service.deepMerge(target, source)).toEqual({
        level1: { level2: { level3: { a: 1, b: 20, c: 3 } } },
      } as any);
    });

    it('should replace arrays instead of merging them', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      expect(service.deepMerge(target, source)).toEqual({ items: [4, 5] });
    });

    it('should replace target array with source object', () => {
      const target = { value: [1, 2, 3] } as any;
      const source = { value: { a: 1 } } as any;
      expect(service.deepMerge(target, source)).toEqual({ value: { a: 1 } });
    });

    it('should replace target object with source array', () => {
      const target = { value: { a: 1 } } as any;
      const source = { value: [1, 2] } as any;
      expect(service.deepMerge(target, source)).toEqual({ value: [1, 2] });
    });

    it('should not override a non-empty nested target object with an empty source object', () => {
      const target = { nested: { a: 1, b: 2 } };
      const source = { nested: {} } as any;
      expect(service.deepMerge(target, source)).toEqual({ nested: { a: 1, b: 2 } });
    });

    it('should set an empty object in target when target property is empty or missing', () => {
      const target = { nested: {} } as any;
      const source = { nested: {} } as any;
      expect(service.deepMerge(target, source)).toEqual({ nested: {} });
    });

    it('should add new nested object from source when missing in target', () => {
      const target = { a: 1 } as any;
      const source = { nested: { b: 2 } } as any;
      expect(service.deepMerge(target, source)).toEqual({ a: 1, nested: { b: 2 } });
    });

    it('should ignore inherited properties on the source', () => {
      const proto = { inherited: 'value' };
      const source = Object.create(proto);
      source.own = 'own';
      const target = { a: 1 } as any;
      const result = service.deepMerge(target, source);
      expect(result).toEqual({ a: 1, own: 'own' } as any);
      expect((result as any).inherited).toBeUndefined();
    });

    it('should override primitive value with object from source', () => {
      const target = { value: 5 } as any;
      const source = { value: { a: 1 } } as any;
      expect(service.deepMerge(target, source)).toEqual({ value: { a: 1 } });
    });

    it('should override object value with primitive from source', () => {
      const target = { value: { a: 1 } } as any;
      const source = { value: 5 } as any;
      expect(service.deepMerge(target, source)).toEqual({ value: 5 });
    });

    it('should handle boolean and number values correctly', () => {
      const target = { flag: true, count: 1 };
      const source = { flag: false, count: 42 };
      expect(service.deepMerge(target, source)).toEqual({ flag: false, count: 42 });
    });

    it('should handle empty target and empty source', () => {
      expect(service.deepMerge({}, {})).toEqual({});
    });
  });
});
