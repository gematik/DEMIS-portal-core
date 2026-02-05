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
import { PasteBoxComponent, SideNavigationComponent, createStepContent } from '@gematik/demis-portal-core-library';
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
  providers: [NotificationService, MessageService, FieldConfigService],
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
   * Handler for PasteBox data pasted event.
   * Converts the flat key-value map from clipboard into nested structure and applies to form.
   *
   * Expected clipboard format: URL key=value&key2=value2&...
   * Keys should use dot notation for nested structures: e.g., "notifyingPerson.name"
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

    // Convert flat key-value pairs to nested structure
    data.forEach((value, key) => {
      const [section, field] = key.split('.');
      if (section && field && formData[section]) {
        formData[section][field] = value;
      }
    });

    // Apply the data to the form
    this.notificationService.patchFormData(formData);
  }

  /**
   * Copies the test data string to clipboard for easy testing.
   */
  copyTestData(): void {
    const testData =
      'URL notifyingPerson.name=Dr. Max Mustermann&notifiedPerson.name=Erika Musterfrau&diseaseChoice.disease=Erkältung&condition.value=Ja&commonData.info=Testdaten&questionnaire.answer=Alles gut';
    navigator.clipboard.writeText(testData);
  }
}
