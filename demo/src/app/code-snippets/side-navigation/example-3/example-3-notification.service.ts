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

import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFormBuilder } from '@ngx-formly/core';
import { DeepMergeService } from '@gematik/demis-portal-core-library';
import { FieldConfigService } from './example-3-field-config.service';

/**
 * Central service to manage the notification form data across all 6 steps.
 * This service provides a shared FormGroup with nested FormGroups for each step,
 * demonstrating a realistic form structure as used in production with ngx-formly.
 */
@Injectable()
export class NotificationService {
  private readonly fb = new FormBuilder();
  private readonly formlyBuilder = inject(FormlyFormBuilder);
  private readonly fieldConfig = inject(FieldConfigService);
  private readonly deepMergeService = inject(DeepMergeService);

  /**
   * Formly model objects for each step.
   * Stable model objects shared by the eagerly built controls and rendered forms.
   * Use patchFormData() to merge imported values into models and controls together.
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
    const steps = [
      { group: this.notifyingPersonGroup, model: this.notifyingPersonModel, fields: this.fieldConfig.notifyingPersonFields },
      { group: this.notifiedPersonGroup, model: this.notifiedPersonModel, fields: this.fieldConfig.notifiedPersonFields },
      { group: this.diseaseChoiceGroup, model: this.diseaseChoiceModel, fields: this.fieldConfig.diseaseChoiceFields },
      { group: this.conditionGroup, model: this.conditionModel, fields: this.fieldConfig.conditionFields },
      { group: this.commonDataGroup, model: this.commonDataModel, fields: this.fieldConfig.commonDataFields },
      { group: this.questionnaireGroup, model: this.questionnaireModel, fields: this.fieldConfig.questionnaireFields },
    ];
    steps.forEach(({ group, model, fields }) => this.formlyBuilder.buildForm(group, fields, model, {}));
    this.diseaseChoiceGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.updateStepAvailability());

    // Disable steps 4, 5, 6 initially
    this.conditionGroup.disable();
    this.commonDataGroup.disable();
    this.questionnaireGroup.disable();
  }

  /**
   * Set or update form data at any time.
   * Deep-merges imported values into the current form values and models.
   * All controls and Formly validators exist before a step is first rendered,
   * so imported data immediately updates the side-navigation validation state.
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
    const mergedData = this.deepMergeService.deepMerge(group.getRawValue(), data);
    Object.assign(model, mergedData);
    group.patchValue(mergedData);
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
   */
  updateStepAvailability(): void {
    const diseaseValue = this.diseaseChoiceGroup.get('code')?.value;

    if (['cvdd', 'msvd'].includes(diseaseValue)) {
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
    return this.notificationForm.getRawValue();
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
    // Clear all model objects
    Object.keys(this.notifyingPersonModel).forEach(key => delete this.notifyingPersonModel[key]);
    Object.keys(this.notifiedPersonModel).forEach(key => delete this.notifiedPersonModel[key]);
    Object.keys(this.diseaseChoiceModel).forEach(key => delete this.diseaseChoiceModel[key]);
    Object.keys(this.conditionModel).forEach(key => delete this.conditionModel[key]);
    Object.keys(this.commonDataModel).forEach(key => delete this.commonDataModel[key]);
    Object.keys(this.questionnaireModel).forEach(key => delete this.questionnaireModel[key]);

    const emptyData = Object.fromEntries(
      Object.entries(this.notificationForm.controls).map(([key, group]) => [key, Object.fromEntries(Object.keys(group.controls).map(field => [field, null]))])
    );
    this.notificationForm.reset(emptyData);

    // Disable steps 4, 5, 6 again (initial state)
    this.conditionGroup.disable();
    this.commonDataGroup.disable();
    this.questionnaireGroup.disable();
  }
}
