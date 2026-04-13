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

import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  Directive,
  Injector,
  OnChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  computed,
  contentChild,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsFooterComponent } from '../forms-footer/forms-footer.component';
import { DemisProcessStepperComponent, ProcessStep, StepChangeEvent } from '../process-stepper/process-stepper.component';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { StepNavigationService } from '../../services/step-navigation.service';

@Component({
  selector: 'gem-demis-side-navigation',
  imports: [NgTemplateOutlet, MatSidenavModule, FormsFooterComponent, DemisProcessStepperComponent, SectionHeaderComponent],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
})
export class SideNavigationComponent implements AfterViewInit, OnChanges {
  private readonly injector = inject(Injector);
  private readonly navigationService = inject(StepNavigationService);
  private readonly dynamicComponentContainer = viewChild<any, ViewContainerRef>('dynamicComponentContainer', { read: ViewContainerRef });

  sideNavTitle = input.required<string>();
  stepsMap = input<Map<ProcessStep, StepContent<any>>>(new Map());
  steps = computed(() => Array.from(this.stepsMap().keys()));
  currentComponentInstance = signal<StepContentComponent<any> | null>(null);
  currentActionsLeft = computed(() => this.currentComponentInstance()?.actionsLeft() ?? null);
  currentActionsRight = computed(() => this.currentComponentInstance()?.actionsRight() ?? null);
  internalStepper = viewChild<DemisProcessStepperComponent>('internalStepper');
  sideNavSubtitle = contentChild<TemplateRef<any>>('sideNavSubtitle');
  additionalSideNavActions = contentChild<TemplateRef<any>>('additionalSideNavActions');

  private currentComponentRef: ComponentRef<StepContentComponent<any>> | null = null;

  ngAfterViewInit(): void {
    const stepper = this.internalStepper();
    if (stepper) {
      this.navigationService.registerStepper(stepper);
    }
    const firstStepContent = this.stepsMap().get(this.steps()[0]);
    this.setStepContent(firstStepContent);
  }

  ngOnChanges(): void {
    const currentStep = this.internalStepper()?.currentStep();
    const stepContent = this.stepsMap().get(currentStep!);
    this.setStepContent(stepContent);
  }

  /**
   * Handles step change events from the internal stepper.
   *
   * @param event  The step change event containing the selected step.
   */
  onStepChanged(event: StepChangeEvent) {
    const resolvedStepContent = this.stepsMap().get(event.selectedStep);
    this.setStepContent(resolvedStepContent);
  }

  /**
   * Sets the current step content component and its inputs based on the provided step content.
   *
   * @param stepContent  The step content containing the component and optional input data.
   */
  private setStepContent<C extends Type<StepContentComponent<any>>>(stepContent: StepContent<C> | undefined) {
    // Clear previous component
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }

    const vcr = this.dynamicComponentContainer();
    if (!vcr) return;

    vcr.clear();
    this.currentComponentInstance.set(null);

    // Create new component if provided
    if (stepContent?.component) {
      this.currentComponentRef = vcr.createComponent(stepContent.component, {
        injector: this.injector,
      });

      // Set inputs
      if (stepContent.inputData !== undefined) {
        this.currentComponentRef.setInput('inputData', stepContent.inputData);
      }

      // Store component instance
      this.currentComponentInstance.set(this.currentComponentRef.instance);
    }
  }
}

/**
 * Extracts the input type T from a StepContentBaseComponent<T> type.
 */
type ExtractInputType<C> = C extends Type<StepContentComponent<infer T>> ? T : never;

/**
 * Defines the content a process step can be mapped to.
 *
 * The generic parameter C is the component type, from which the input data type is automatically inferred.
 * This ensures that inputData matches the component's expected input type.
 *
 * **IMPORTANT**: Always use createStepContent() to create StepContent objects.
 * While TypeScript cannot technically enforce this due to structural typing,
 * createStepContent() provides better type inference and ensures consistency.
 *
 * - component: The component class to render for the step.
 * - inputData: Optional input data to pass to the component. Type must match the component's input type.
 */
export interface StepContent<C extends Type<StepContentComponent<any>> = any> {
  component: C;
  inputData?: ExtractInputType<C>;
}

/**
 * Helper function to create a StepContent object with automatic type inference.
 * TypeScript will infer the correct type for inputData based on the component type.
 *
 * **ALWAYS use this function** to create StepContent objects for consistency and better type inference.
 *
 * @param config The step content configuration
 * @returns A properly typed StepContent object with type-safe inputData
 *
 * @example
 * ```typescript
 * // ✅ CORRECT - type-safe inputData
 * const content = createStepContent({
 *   component: MyComponent, // extends StepContentComponent<{name: string}>
 *   inputData: { name: 'John' } // TypeScript knows this must be {name: string}
 * });
 *
 * // ❌ AVOID - works but bypasses helper
 * const content: StepContent = {
 *   component: MyComponent,
 *   inputData: { name: 'John' }
 * };
 * ```
 */
export function createStepContent<C extends Type<StepContentComponent<any>>>(config: { component: C; inputData?: ExtractInputType<C> }): StepContent<C> {
  return config;
}

/**
 * Base class for step content components.
 * Provides a common input property (inputData) for passing data to the step content.
 * Also provides viewChild references for action templates that can be defined in the component template.
 *
 * - T: The type of the input data.
 *
 * Child components can define action templates using:
 * - <ng-template #actionsLeft>...</ng-template>
 * - <ng-template #actionsRight>...</ng-template>
 *
 * These templates can inject StepNavigation to access navigation methods:
 * - navigation.next()
 * - navigation.previous()
 * - navigation.reset()
 * - navigation.goToStep(index)
 * - navigation.goToStepByKey(key)
 * - navigation.canGoToNext()
 * - navigation.canGoToPrevious()
 */
@Directive()
export abstract class StepContentComponent<T> {
  inputData = input<T | undefined>(undefined);
  actionsLeft = viewChild<TemplateRef<any>>('actionsLeft');
  actionsRight = viewChild<TemplateRef<any>>('actionsRight');
}
