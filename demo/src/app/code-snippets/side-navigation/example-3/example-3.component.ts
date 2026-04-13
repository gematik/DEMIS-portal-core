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

import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasteBoxComponent, SideNavigationComponent, provideStepNavigation, createStepContent } from '@gematik/demis-portal-core-library';
import { Subject, takeUntil } from 'rxjs';
import {
  Example3CommonContentComponent,
  Example3ConditionContentComponent,
  Example3DiseaseChoiceContentComponent,
  Example3NotifiedPersonContentComponent,
  Example3NotifyingPersonContentComponent,
  Example3QuestionnaireContentComponent,
} from './example-3-content-components';
import { MessageService } from './example-3-message.service';
import { NotificationService } from './example-3-notification.service';
import { FieldConfigService } from './example-3-field-config.service';
import { getStepData } from './example-3.step-data';

@Component({
  selector: 'app-side-navigation-example-3',
  standalone: true,
  imports: [SideNavigationComponent, MatButtonModule, MatIconModule, PasteBoxComponent],
  providers: [provideStepNavigation(), NotificationService, MessageService, FieldConfigService],
  templateUrl: './example-3.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 640px;
      }
    `,
  ],
})
export class SideNavigationExample3Component implements OnInit, OnDestroy {
  messageService = inject(MessageService);
  notificationService = inject(NotificationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    /* Subscribe to disease choice changes to enable/disable subsequent steps.
     * We watch the diseaseChoice FormGroup's valueChanges instead of the individual control
     * because Formly creates the controls dynamically after template rendering.
     */
    this.notificationService.diseaseChoiceGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notificationService.updateStepAvailability();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Define the step contents with their respective components and input data.
   *
   * IMPORTANT: Always use createStepContent() to create step content objects.
   * This provides:
   * - Automatic type inference for inputData based on the component's expected type
   * - Type safety ensuring inputData matches the component's requirements
   * - Better IDE support with autocompletion
   * - Consistent API across the codebase
   *
   * Example: The inputData for Example3NotifiedPersonContentComponent is automatically
   * typed as NotifiedPersonInput, so TypeScript will catch any typos or wrong properties.
   */
  private readonly stepContents = computed(() => [
    createStepContent({ component: Example3NotifyingPersonContentComponent }),
    createStepContent({
      component: Example3NotifiedPersonContentComponent,
      inputData: { magicSpell: 'Expecto Patronum' },
    }),
    createStepContent({ component: Example3DiseaseChoiceContentComponent }),
    createStepContent({ component: Example3ConditionContentComponent }),
    createStepContent({ component: Example3CommonContentComponent }),
    createStepContent({ component: Example3QuestionnaireContentComponent }),
  ]);

  // Map the process steps to their corresponding step contents
  readonly stepsMap = computed(() => {
    const stepData = getStepData(this.notificationService);
    return new Map(stepData.map((step, index) => [step, this.stepContents()[index]]));
  });

  /**
   * Maps DEMIS clipboard key prefixes to internal form group names.
   * Keys use the DEMIS standard format: PREFIX.field (e.g. N.given, P.family, D.code)
   * See: https://wiki.gematik.de/spaces/DSKB/pages/474112380
   */
  private static readonly PREFIX_TO_GROUP: Record<string, string> = {
    N: 'notifyingPerson',
    F: 'notifyingPerson',
    P: 'notifiedPerson',
    D: 'diseaseChoice',
    C: 'commonData',
    B: 'commonData',
    T: 'commonData',
    S: 'notifyingPerson',
  };

  /** D.* keys that belong to the condition step instead of diseaseChoice */
  private static readonly CONDITION_KEYS = new Set(['status', 'start', 'diagnosis', 'symptoms', 'note', 'note.status']);

  /** C.* keys that belong to the questionnaire step instead of commonData */
  private static readonly QUESTIONNAIRE_KEYS = new Set(['hospitalized', 'death', 'deathDate', 'military']);

  /**
   * Handler for PasteBox data pasted event.
   * Converts the flat key-value map from clipboard into nested structure and applies to form.
   *
   * Expected clipboard format: URL key=value&key2=value2&...
   * Keys use the DEMIS standard: PREFIX.field (e.g. N.given, P.family, D.code)
   */
  onDataPasted(data: Map<string, string>): void {
    const formData: any = {
      notifyingPerson: {},
      notifiedPerson: {},
      diseaseChoice: {},
      condition: {},
      commonData: {},
      questionnaire: {},
    };

    data.forEach((value, key) => {
      const dotIndex = key.indexOf('.');
      if (dotIndex < 0) return;

      const prefix = key.substring(0, dotIndex);
      const field = key.substring(dotIndex + 1);
      if (!prefix || !field) return;

      let group = SideNavigationExample3Component.PREFIX_TO_GROUP[prefix];
      if (!group) return;

      // Route specific D.* and C.* keys to their correct step
      if (prefix === 'D' && SideNavigationExample3Component.CONDITION_KEYS.has(field)) {
        group = 'condition';
      } else if (prefix === 'C' && SideNavigationExample3Component.QUESTIONNAIRE_KEYS.has(field)) {
        group = 'questionnaire';
      }

      if (formData[group]) {
        formData[group][field] = value;
      }
    });

    // Apply the data to the form
    this.notificationService.patchFormData(formData);
  }

  /**
   * Copies the test data string to clipboard for easy testing.
   * Uses the official DEMIS clipboard data format.
   */
  copyTestData(): void {
    const testData =
      'URL N.given=Max&N.family=Mustermann&P.given=Erika&P.family=Musterfrau&D.code=cvdd&D.status=final&C.importantInfo=Kontaktperson%20identifiziert&C.hospitalized=yes';
    navigator.clipboard.writeText(testData);
  }
}
