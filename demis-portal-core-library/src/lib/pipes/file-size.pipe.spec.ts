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



import { FileSizePipe } from './file-size.pipe';
import { MockBuilder } from 'ng-mocks';

describe('FileSizePipe', () => {
  let pipe: FileSizePipe;

  beforeEach(() => MockBuilder(FileSizePipe));

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error for undefined size', () => {
    const result = pipe.transform(undefined);
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should return "1023 bytes" for size of 1023', () => {
    const result = pipe.transform(1023);
    expect(result).toBe('1023 bytes');
  });

  it('should return "1.00 KB" for size of 1024', () => {
    const result = pipe.transform(1024);
    expect(result).toBe('1.00 KB');
  });

  it('should return "47.12 KB" for size of 48250', () => {
    const result = pipe.transform(48250);
    expect(result).toBe('47.12 KB');
  });

  it('should return "1.00 MB" for size of 1048576', () => {
    const result = pipe.transform(1048576);
    expect(result).toBe('1.00 MB');
  });

  it('should return "47.11 MB" for size of 49398415', () => {
    const result = pipe.transform(49398415);
    expect(result).toBe('47.11 MB');
  });

  it('should return "1.00 GB" for size of 1073741824', () => {
    const result = pipe.transform(1073741824);
    expect(result).toBe('1.00 GB');
  });

  it('should return "47.13 GB" for size of 50605452165', () => {
    const result = pipe.transform(50605452165);
    expect(result).toBe('47.13 GB');
  });
});
