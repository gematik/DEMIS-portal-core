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

import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  type ClipboardImportResult,
  PasteBoxComponent,
  SideNavigationComponent,
  provideStepNavigation,
  createStepContent,
} from '@gematik/demis-portal-core-library';
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
export class SideNavigationExample3Component {
  messageService = inject(MessageService);
  notificationService = inject(NotificationService);

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

  private static readonly CLIPBOARD_FIELDS = new Map([
    ['N.given', ['notifyingPerson', 'given']],
    ['N.family', ['notifyingPerson', 'family']],
    ['P.given', ['notifiedPerson', 'given']],
    ['P.family', ['notifiedPerson', 'family']],
    ['D.code', ['diseaseChoice', 'code']],
    ['D.status', ['condition', 'status']],
    ['C.importantInfo', ['commonData', 'importantInfo']],
    ['C.hospitalized', ['questionnaire', 'hospitalized']],
  ]);

  readonly importClipboardData = (clipboardData: Map<string, string>): ClipboardImportResult => {
    const formData: Record<string, Record<string, string>> = {};
    let importedCount = 0;

    clipboardData.forEach((value, key) => {
      const target = SideNavigationExample3Component.CLIPBOARD_FIELDS.get(key);
      if (!target || value.trim() === '' || (key === 'D.code' && !['cvdd', 'msvd'].includes(value))) {
        return;
      }

      const [group, field] = target;
      formData[group] ??= {};
      formData[group][field] = value;
      importedCount++;
    });

    if (importedCount === 0) {
      return 'empty';
    }

    this.notificationService.patchFormData(formData);
    return importedCount === clipboardData.size ? 'success' : 'partial';
  };

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
