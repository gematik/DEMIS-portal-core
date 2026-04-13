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

import { computed, Injectable, signal } from '@angular/core';
import { DemisProcessStepperComponent } from '../components/process-stepper/process-stepper.component';
import { StepNavigation } from './step-navigation';

/**
 * Injectable service for step navigation.
 * Provides navigation methods that are late-bound to a DemisProcessStepperComponent.
 *
 * Must be provided by the host component (e.g., in its `providers` array).
 * The SideNavigationComponent registers its internal stepper with this service automatically.
 *
 * Step content components should inject {@link StepNavigation} instead
 * to avoid access to the internal {@link registerStepper} method.
 */
@Injectable()
export class StepNavigationService extends StepNavigation {
  private readonly stepperRef = signal<DemisProcessStepperComponent | null>(null);

  readonly canGoToNext = computed(() => this.stepperRef()?.canGoToNext() ?? false);
  readonly canGoToPrevious = computed(() => this.stepperRef()?.canGoToPrevious() ?? false);
  readonly currentStepIndex = computed(() => this.stepperRef()?.currentStepIndex() ?? 0);
  readonly currentStep = computed(() => this.stepperRef()?.currentStep() ?? undefined);

  next(): void {
    this.stepperRef()?.next();
  }

  previous(): void {
    this.stepperRef()?.previous();
  }

  reset(): void {
    this.stepperRef()?.reset();
  }

  goToStep(index: number): void {
    this.stepperRef()?.goToStep(index);
  }

  goToStepByKey(key: string): void {
    this.stepperRef()?.goToStepByKey(key);
  }

  registerStepper(stepper: DemisProcessStepperComponent): void {
    this.stepperRef.set(stepper);
  }
}
