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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { TestBed } from '@angular/core/testing';

import { MaxContainerHeightService } from './max-container-height.service';

describe('MaxContainerHeightService', () => {
  let service: MaxContainerHeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxContainerHeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the max container height', () => {
    const appNavbar = document.createElement('app-navbar');
    const appNavbarAny = {
      ...(appNavbar as any),
      get clientHeight() {
        return 123;
      },
    };

    const maxHeight = service.calculateMaxContainerHeight([appNavbarAny as Element]);

    expect(maxHeight).toBe('calc(100vh - 123px)');
  });

  it('should return the default max client height with no useful Element information', () => {
    const maxHeight = service.calculateMaxContainerHeight(undefined);

    expect(maxHeight).toBe('100vh');
  });
});
