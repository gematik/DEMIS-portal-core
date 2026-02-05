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
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Central service to manage the notification form data across all 6 steps.
 * This service provides a shared FormGroup with nested FormGroups for each step,
 * demonstrating a realistic form structure as used in production with ngx-formly.
 */
@Injectable()
export class NotificationService {
  private readonly fb = new FormBuilder();

  /**
   * Formly model objects for each step.
   * These are initialized once and should NOT be mutated directly after Formly renders.
   * Use patchFormData() method to update values after initialization.
   */
  readonly notifyingPersonModel: any = {};
  readonly notifiedPersonModel: any = {};
  readonly diseaseChoiceModel: any = {};
  readonly conditionModel: any = {};
  readonly commonDataModel: any = {};
  readonly questionnaireModel: any = {};

  /**
   * Main form group containing nested FormGroups for each of the 6 steps.
   * Each step has its own FormGroup containing the relevant FormControls.
   * Steps 4, 5, 6 are initially disabled until a disease is selected.
   */
  readonly notificationForm = this.fb.group({
    notifyingPerson: this.fb.group({}),
    notifiedPerson: this.fb.group({}),
    diseaseChoice: this.fb.group({}),
    condition: this.fb.group({}),
    commonData: this.fb.group({}),
    questionnaire: this.fb.group({}),
  });

  constructor() {
    // Disable steps 4, 5, 6 initially
    this.conditionGroup.disable();
    this.commonDataGroup.disable();
    this.questionnaireGroup.disable();
  }

  /**
   * Set or update form data at any time.
   * Uses a hybrid approach to work in all scenarios:
   * - Updates model objects (for steps not yet rendered - Formly will use these when creating controls)
   * - Updates FormGroups via patchValue (for already rendered steps - immediate update)
   *
   * This ensures data is applied correctly regardless of whether the step has been visited/rendered yet.
   *
   * Example usage:
   * ```
   * // Can be called anytime - before or after rendering
   * notificationService.patchFormData({
   *   notifyingPerson: { name: 'Dr. Smith' },
   *   diseaseChoice: { disease: 'Erkältung' }
   * });
   *
   * // Works even if user has already entered some data
   * notificationService.patchFormData({
   *   diseaseChoice: { disease: 'Andere Krankheit' } // Only updates this field
   * });
   * ```
   */
  patchFormData(data: { notifyingPerson?: any; notifiedPerson?: any; diseaseChoice?: any; condition?: any; commonData?: any; questionnaire?: any }): void {
    // Define mappings between data keys, models, and FormGroups
    const stepMappings = [
      { key: 'notifyingPerson' as const, model: this.notifyingPersonModel, group: this.notifyingPersonGroup },
      { key: 'notifiedPerson' as const, model: this.notifiedPersonModel, group: this.notifiedPersonGroup },
      { key: 'diseaseChoice' as const, model: this.diseaseChoiceModel, group: this.diseaseChoiceGroup },
      { key: 'condition' as const, model: this.conditionModel, group: this.conditionGroup },
      { key: 'commonData' as const, model: this.commonDataModel, group: this.commonDataGroup },
      { key: 'questionnaire' as const, model: this.questionnaireModel, group: this.questionnaireGroup },
    ];

    // Phase 1: Update models and FormGroups with new values
    stepMappings.forEach(({ key, model, group }) => {
      if (data[key]) {
        this.patchStep(model, group, data[key]);
      }
    });

    // Phase 2: Update step availability based on new data
    // IMPORTANT: Must be done before validation (disabled FormGroups are never valid)
    this.updateStepAvailability();

    // Phase 3: Trigger validation and statusChanges events
    stepMappings.forEach(({ key, group }) => {
      if (data[key]) {
        this.updateStepValidation(group);
      }
    });
  }

  /**
   * Helper method to update both model and FormGroup for a single step.
   */
  private patchStep(model: any, group: FormGroup, data: any): void {
    // Update model for not-yet-rendered forms
    Object.assign(model, data);
    // Update FormGroup for already-rendered forms
    group.patchValue(data);
  }

  /**
   * Helper method to trigger validation update and statusChanges emission.
   */
  private updateStepValidation(group: FormGroup): void {
    group.markAllAsTouched();
    group.updateValueAndValidity({ emitEvent: true });
  }

  /**
   * Updates the availability (enabled/disabled state) of steps 4-6 based on disease selection.
   * Steps 4, 5, 6 are only enabled when a valid disease is selected.
   * This method is public so it can be called from valueChanges subscriptions in components.
   */
  updateStepAvailability(): void {
    const diseaseValue = this.diseaseChoiceModel.disease || this.diseaseChoiceGroup.value?.disease;

    if (diseaseValue && diseaseValue !== null) {
      // Enable steps 4, 5, 6 when disease is selected
      this.conditionGroup.enable({ emitEvent: false });
      this.commonDataGroup.enable({ emitEvent: false });
      this.questionnaireGroup.enable({ emitEvent: false });
    } else {
      // Disable steps 4, 5, 6 when no disease is selected
      this.conditionGroup.disable({ emitEvent: false });
      this.commonDataGroup.disable({ emitEvent: false });
      this.questionnaireGroup.disable({ emitEvent: false });
    }
  }

  /**
   * Typed getters for nested FormGroups.
   * Individual controls can be accessed via group.get('controlName').
   * Example: notifyingPersonGroup.get('name')
   */
  get notifyingPersonGroup(): FormGroup {
    return this.notificationForm.get('notifyingPerson') as FormGroup;
  }

  get notifiedPersonGroup(): FormGroup {
    return this.notificationForm.get('notifiedPerson') as FormGroup;
  }

  get diseaseChoiceGroup(): FormGroup {
    return this.notificationForm.get('diseaseChoice') as FormGroup;
  }

  get conditionGroup(): FormGroup {
    return this.notificationForm.get('condition') as FormGroup;
  }

  get commonDataGroup(): FormGroup {
    return this.notificationForm.get('commonData') as FormGroup;
  }

  get questionnaireGroup(): FormGroup {
    return this.notificationForm.get('questionnaire') as FormGroup;
  }

  /**
   * Get the current form data as a plain JavaScript object.
   */
  getFormData(): any {
    return this.notificationForm.value;
  }

  /**
   * Check if the entire form is valid.
   */
  isFormValid(): boolean {
    return this.notificationForm.valid;
  }

  /**
   * Reset the form to its initial state.
   * This includes:
   * - Resetting all FormGroups
   * - Clearing all model objects
   * - Disabling steps 4, 5, 6 again
   */
  resetForm(): void {
    // Reset all FormGroups
    this.notificationForm.reset();

    // Clear all model objects
    Object.keys(this.notifyingPersonModel).forEach(key => delete this.notifyingPersonModel[key]);
    Object.keys(this.notifiedPersonModel).forEach(key => delete this.notifiedPersonModel[key]);
    Object.keys(this.diseaseChoiceModel).forEach(key => delete this.diseaseChoiceModel[key]);
    Object.keys(this.conditionModel).forEach(key => delete this.conditionModel[key]);
    Object.keys(this.commonDataModel).forEach(key => delete this.commonDataModel[key]);
    Object.keys(this.questionnaireModel).forEach(key => delete this.questionnaireModel[key]);

    // Disable steps 4, 5, 6 again (initial state)
    this.conditionGroup.disable();
    this.commonDataGroup.disable();
    this.questionnaireGroup.disable();
  }
}
