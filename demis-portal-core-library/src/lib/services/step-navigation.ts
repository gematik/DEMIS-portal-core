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

import { Signal } from '@angular/core';
import { ProcessStep } from '../components/process-stepper/process-stepper.component';

/**
 * Abstract navigation interface for step-based workflows.
 *
 * Inject this class in step content components and host components
 * to access navigation controls without exposing internal registration methods.
 *
 * Use {@link provideStepNavigation} in the host component's `providers` array:
 * ```ts
 * providers: [provideStepNavigation()]
 * ```
 */
export abstract class StepNavigation {
  abstract readonly canGoToNext: Signal<boolean>;
  abstract readonly canGoToPrevious: Signal<boolean>;
  abstract readonly currentStepIndex: Signal<number>;
  abstract readonly currentStep: Signal<ProcessStep | undefined>;

  abstract next(): void;
  abstract previous(): void;
  abstract reset(): void;
  abstract goToStep(index: number): void;
  abstract goToStepByKey(key: string): void;
}
