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

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { MediaMatcher } from '@angular/cdk/layout';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ngMocks } from 'ng-mocks';

setupTestBed({
  zoneless: false,
  teardown: { destroyAfterEach: true },
});

// ng-mocks >= 14.18.0 auto-mocks these root-provided CDK services, which breaks
// Angular Material directives that use them inside their constructors.
ngMocks.globalKeep(MediaMatcher, true);
ngMocks.globalKeep(UniqueSelectionDispatcher, true);
ngMocks.globalKeep(FocusMonitor, true);
ngMocks.globalKeep(Directionality, true);
