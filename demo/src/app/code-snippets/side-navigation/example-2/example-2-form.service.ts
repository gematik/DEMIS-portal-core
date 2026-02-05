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

import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Service to manage form data across all 6 steps.
 * Provides a central FormGroup with individual FormControls for each step.
 */
@Injectable()
export class FormService {
  private readonly fb = new FormBuilder();

  /**
   * Main FormGroup containing all step FormControls.
   */
  readonly mainFormGroup: FormGroup = this.fb.group({
    step1: ['', Validators.required],
    step2: ['', Validators.required],
    step3: ['', Validators.required],
    step4: ['', Validators.required],
    step5: ['', Validators.required],
    step6: ['', Validators.required],
  });

  /**
   * Get individual FormControl for a step.
   */
  getStepControl(stepKey: string): FormControl {
    return this.mainFormGroup.get(stepKey) as FormControl;
  }

  /**
   * Check if the entire form is valid.
   */
  isFormValid(): boolean {
    return this.mainFormGroup.valid;
  }

  /**
   * Get all form data as plain object.
   */
  getFormData(): any {
    return this.mainFormGroup.value;
  }
}
