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

import { Component, ElementRef, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { DemisProcessStepperComponent, ProcessStep, StepChangeEvent } from '@gematik/demis-portal-core-library';
import { stepData } from './example-1.step-data';

@Component({
  selector: 'app-stepper-example-1',
  standalone: true,
  imports: [DemisProcessStepperComponent, MatButton],
  templateUrl: './example-1.component.html',
})
export class StepperExample1Component {
  @ViewChild('stepper') stepper!: DemisProcessStepperComponent;
  @ViewChild('log') log!: ElementRef<HTMLTextAreaElement>;

  get steps() {
    return stepData;
  }

  resetStep(step: ProcessStep) {
    const ctrl = step.control as FormGroup;
    ctrl.reset();
    ctrl.markAsUntouched();
    ctrl.updateValueAndValidity();
  }

  changeStepValidity(step: ProcessStep, valid: boolean) {
    const ctrl = step.control as FormGroup;
    ctrl.controls['input'].setValue(valid ? 'ok' : '');
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }

  onStepChange(e: StepChangeEvent) {
    this.log.nativeElement.value = [
      `Step changed from "(${e.previouslySelectedIndex + 1}) ${e.previouslySelectedStep?.label}"`,
      ` to "(${e.selectedIndex + 1}) ${e.selectedStep.label}"\n${this.log.nativeElement.value}`,
    ].join('');
  }
}
