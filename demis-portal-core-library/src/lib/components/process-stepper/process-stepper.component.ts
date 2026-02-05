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

import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatStep, MatStepper, MatStepperModule } from '@angular/material/stepper';

/**
 * Defines a single step in the process stepper.
 *
 * - key:         A unique identifier for the step.
 * - label:       The display label for the step.
 * - description: An optional description for the step.
 * - control:     An AbstractControl instance to manage the step's state and validity.
 */
export declare type ProcessStep = {
  key: string;
  label: string;
  description?: string;
  control: AbstractControl;
};

/**
 * Event emitted when the selected step changes.
 *
 * - selectedIndex:           The index of the newly selected step.
 * - selectedStep:            The newly selected step.
 * - previouslySelectedIndex: The index of the previously selected step.
 * - previouslySelectedStep:  The previously selected step.
 */
export declare type StepChangeEvent = {
  selectedIndex: number;
  selectedStep: ProcessStep;
  previouslySelectedIndex: number;
  previouslySelectedStep: ProcessStep | undefined;
};

@Component({
  selector: 'gem-demis-process-stepper',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatStepperModule, MatIconModule, NgTemplateOutlet],
  templateUrl: './process-stepper.component.html',
  styleUrls: ['./process-stepper.component.scss'],
  providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } }],
})
export class DemisProcessStepperComponent implements AfterViewInit, AfterViewChecked {
  readonly steps = input.required<ProcessStep[]>();
  readonly initStepIndex = input<number>(0);
  readonly currentStepIndex = signal(this.initStepIndex());
  readonly currentStep = computed(() => {
    if (this.currentStepIndex() >= 0 && this.currentStepIndex() < this.steps().length) {
      return this.steps().at(this.currentStepIndex());
    }
    return undefined;
  });

  /**
   * Signal that triggers re-evaluation of computed properties when step control states change.
   * Updated reactively via statusChanges subscriptions.
   * Uses empty object type - each {} creates a new reference, ensuring change detection.
   */
  private readonly controlStatesChanged = signal({});

  /**
   * Map to store the validity state of steps before they are disabled.
   * Key: step key, Value: object with touched and valid state
   */
  private readonly stepValidityStateBeforeDisabled = new Map<string, { touched: boolean; valid: boolean }>();

  /**
   * Computed property to check if navigation to the next step is possible.
   * Returns true only if a next step exists and is not disabled.
   */
  readonly canGoToNext = computed(() => {
    // Depend on controlStatesChanged to trigger re-evaluation when control states change
    this.controlStatesChanged();
    const currentIndex = this.currentStepIndex();
    const steps = this.steps();

    // Cannot go forward if state is invalid or no steps exist
    if (currentIndex === undefined || !steps.length) return false;

    const nextStep = steps[currentIndex + 1];
    // Can only go forward if next step exists and is not disabled
    return nextStep !== undefined && !nextStep.control.disabled;
  });

  /**
   * Computed property to check if navigation to the previous step is possible.
   * Returns true only if a previous step exists and is not disabled.
   */
  readonly canGoToPrevious = computed(() => {
    // Depend on controlStatesChanged to trigger re-evaluation when control states change
    this.controlStatesChanged();
    const currentIndex = this.currentStepIndex();
    const steps = this.steps();

    // Cannot go backward if state is invalid or no steps exist
    if (currentIndex === undefined || !steps.length) return false;

    const previousStep = steps[currentIndex - 1];
    // Can only go backward if previous step exists and is not disabled
    return previousStep !== undefined && !previousStep.control.disabled;
  });

  readonly stepChange = output<StepChangeEvent>();

  readonly stepper = viewChild.required<MatStepper>('stepper');
  private readonly stepperElementRef = viewChild.required('stepper', { read: ElementRef<HTMLElement> });

  constructor() {
    // Subscribe to statusChanges of all step controls to reactively update button states
    effect(onCleanup => {
      const steps = this.steps();
      if (!steps.length) return;

      // Merge all statusChanges observables from step controls
      const statusChanges$ = merge(...steps.map(step => step.control.statusChanges));

      // Subscribe and trigger signal on any status change
      const subscription = statusChanges$.subscribe(() => {
        // Track validity state before controls become disabled
        steps.forEach(step => {
          if (!step.control.disabled) {
            // Store the current validity state while the control is still enabled
            this.stepValidityStateBeforeDisabled.set(step.key, {
              touched: step.control.touched,
              valid: step.control.valid,
            });
          }
        });
        this.controlStatesChanged.set({});
      });

      // Cleanup subscription when effect re-runs or component is destroyed
      onCleanup(() => subscription.unsubscribe());
    });
  }

  /**
   * Disables a step in the stepper.
   *
   * @param step        The step to disable.
   * @param stepElement The DOM element representing the step.
   */
  private disableStep(step: MatStep, stepElement: Element) {
    step.state = 'disabled';
    stepElement.classList.add('step-disabled');
  }

  /**
   * Enables a step in the stepper.
   *
   * @param step        The step to enable.
   * @param stepElement The DOM element representing the step.
   */
  private enableStep(step: MatStep, stepElement: Element) {
    if (step.state === 'disabled') {
      step.state = 'number';
      stepElement.classList.remove('step-disabled');
    }
  }

  /**
   * Post-processes the rendered steps to ensure that their enabled/disabled state matches the state of their associated controls.
   *
   * This method iterates over each step in the stepper, retrieves the corresponding DOM element, and updates its state and CSS
   * classes based on whether the associated control is disabled or enabled. It is called after the view has been checked to
   * ensure that any changes in the control states are reflected in the UI.
   * It also sets the title attribute of each step element for better accessibility and user experience, when title texts are
   * too long to be fully displayed.
   */
  private postProcessRenderedSteps() {
    // Guard against undefined stepper.steps (e.g., in tests with mocks)
    const stepper = this.stepper();
    if (!stepper?.steps || !(stepper.steps instanceof QueryList)) {
      return;
    }

    stepper.steps.forEach((step: MatStep, index: number) => {
      const stepElement = this.stepperElementRef().nativeElement.querySelectorAll('.mat-step').item(index);
      const stepData = this.steps().at(index);
      // Set title attribute for better accessibility and UX
      stepElement?.setAttribute('title', stepData?.label ?? '');

      if (stepData) {
        // Track validity state - save initial state even for disabled controls
        // For enabled controls, continuously update the state
        // For disabled controls, only save if not already saved (preserves state before disabling)
        if (!stepData.control.disabled || !this.stepValidityStateBeforeDisabled.has(stepData.key)) {
          this.stepValidityStateBeforeDisabled.set(stepData.key, {
            touched: stepData.control.touched,
            valid: stepData.control.valid,
          });
        }

        // Update disabled/enabled state
        if (stepData.control.disabled) {
          this.disableStep(step, stepElement);
        } else {
          this.enableStep(step, stepElement);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.stepper().selectedIndex = this.initStepIndex();
    this.currentStepIndex.set(this.initStepIndex());
  }

  ngAfterViewChecked(): void {
    this.postProcessRenderedSteps();
  }

  /**
   * Checks if a step is completed.
   *
   * @param step The step to check.
   * @returns    True if the step is completed, false otherwise.
   */
  isCompleted(step: ProcessStep): boolean {
    // For disabled controls, use the saved state before disabling
    if (step.control.disabled) {
      const savedState = this.stepValidityStateBeforeDisabled.get(step.key);
      if (savedState) {
        return savedState.touched && savedState.valid;
      }
    }
    return step.control.touched && step.control.valid;
  }

  /**
   * Checks if a step has an error.
   *
   * @param step The step to check.
   * @returns    True if the step has an error, false otherwise.
   */
  hasError(step: ProcessStep) {
    // For disabled controls, use the saved state before disabling
    if (step.control.disabled) {
      const savedState = this.stepValidityStateBeforeDisabled.get(step.key);
      if (savedState) {
        return savedState.touched && !savedState.valid;
      }
    }
    return step.control.touched && !this.isCompleted(step);
  }

  /**
   * Checks if a disabled step was completed before being disabled.
   * This preserves the validity state visually for disabled steps.
   *
   * @param step The step to check.
   * @returns    True if the disabled step was previously valid, false otherwise.
   */
  wasCompletedBeforeDisabled(step: ProcessStep): boolean {
    const savedState = this.stepValidityStateBeforeDisabled.get(step.key);
    return savedState ? savedState.touched && savedState.valid : false;
  }

  /**
   * Checks if a disabled step had errors before being disabled.
   * This preserves the error state visually for disabled steps.
   *
   * @param step The step to check.
   * @returns    True if the disabled step had errors before, false otherwise.
   */
  hadErrorBeforeDisabled(step: ProcessStep): boolean {
    const savedState = this.stepValidityStateBeforeDisabled.get(step.key);
    return savedState ? savedState.touched && !savedState.valid : false;
  }

  /**
   * Handles the selection change event of the stepper.
   *
   * If the target step is disabled, it reverts to the previous step.
   * Otherwise, it emits a step change event if the previous step was not disabled.
   *
   * @param event The selection change event.
   */
  onSelectionChange(event: StepperSelectionEvent): void {
    const previousIndex = event.previouslySelectedIndex;
    const previouslySelectedStep = this.steps().at(previousIndex);
    const targetIndex = event.selectedIndex;
    const targetStep = this.steps().at(targetIndex);

    if (targetStep?.control.disabled) {
      // Promise-based asynchronous execution to avoid race conditions
      Promise.resolve().then(() => {
        this.stepper().selectedIndex = previousIndex;
        this.currentStepIndex.set(previousIndex);
      });
      return; // Early return to prevent navigating to a disabled step
    }

    if (!targetStep) {
      return; // Early return if the target step does not exist
    }

    if (!previouslySelectedStep?.control.disabled) {
      this.stepChange.emit({
        selectedIndex: targetIndex,
        selectedStep: targetStep,
        previouslySelectedIndex: previousIndex,
        previouslySelectedStep: previouslySelectedStep,
      });
    }
    this.currentStepIndex.set(targetIndex);
  }

  /**
   * Moves to the next step in the stepper.
   */
  next() {
    this.stepper().next();
  }

  /**
   * Moves to the previous step in the stepper.
   */
  previous() {
    this.stepper().previous();
  }

  /**
   * Resets the stepper to its initial state.
   */
  reset() {
    this.stepper().reset();
    this.currentStepIndex.set(this.initStepIndex());
  }
}
