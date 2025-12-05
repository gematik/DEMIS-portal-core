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

import { Component, ElementRef, ViewChild } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { DemisProcessStepperComponent, StepChangeEvent } from '@gematik/demis-portal-core-library';
import { stepData } from './example-2.step-data';

@Component({
  selector: 'app-stepper-example-2',
  standalone: true,
  imports: [DemisProcessStepperComponent, MatButton],
  templateUrl: './example-2.component.html',
})
export class StepperExample2Component {
  @ViewChild('stepper') stepper!: DemisProcessStepperComponent;
  @ViewChild('log') log!: ElementRef<HTMLTextAreaElement>;

  get steps() {
    return stepData;
  }

  resetStepper() {
    this.stepper.reset();
    this.steps.forEach((step, index) => {
      if (index !== 0) {
        step.control.disable();
      } else {
        step.control.enable();
      }
    });
  }

  /**
   * Completes the current step and moves to the next step.
   *
   * @param stepIndex  The index of the step to complete.
   */
  completeStep(stepIndex: number) {
    // Get necessary steps
    const currentStep = this.steps.at(stepIndex);
    const nextStep = this.steps.at(stepIndex + 1);
    if (!currentStep) {
      return; // Early return if the current step does not exist
    }
    // Mark current step as completed by setting a valid value
    currentStep.control.setValue('ok');
    // Ensure the current control is marked as touched and validity is updated
    currentStep.control.markAsTouched();
    currentStep.control.updateValueAndValidity();
    // If there is a next step, enable it and move to it
    if (nextStep) {
      nextStep.control.enable();
      this.stepper.next();
    }
  }

  onStepChange(e: StepChangeEvent) {
    this.log.nativeElement.value = [
      `Step changed from "(${e.previouslySelectedIndex + 1}) ${e.previouslySelectedStep?.label}"`,
      ` to "(${e.selectedIndex + 1}) ${e.selectedStep.label}"\n${this.log.nativeElement.value}`,
    ].join('');
  }
}
