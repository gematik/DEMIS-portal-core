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
import { SideNavigationComponent, createStepContent } from '@gematik/demis-portal-core-library';
import {
  Example2Step1ContentComponent,
  Example2Step2ContentComponent,
  Example2Step3ContentComponent,
  Example2Step4ContentComponent,
  Example2Step5ContentComponent,
  Example2Step6ContentComponent,
} from './example-2-content-components';
import { FormService } from './example-2-form.service';
import { MessageService } from './example-2-message.service';
import { getStepData } from './example-2.step-data';

@Component({
  selector: 'app-side-navigation-example-2',
  standalone: true,
  imports: [SideNavigationComponent],
  providers: [FormService, MessageService],
  templateUrl: './example-2.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 640px;
      }
    `,
  ],
})
export class SideNavigationExample2Component {
  formService = inject(FormService);
  messageService = inject(MessageService);

  /**
   * Define the step contents with their respective components.
   *
   * IMPORTANT: Always use createStepContent() to create step content objects.
   * This provides:
   * - Automatic type inference for inputData based on the component's expected type
   * - Type safety ensuring inputData matches the component's requirements
   * - Better IDE support with autocompletion
   * - Consistent API across the codebase
   */
  private readonly stepContents = computed(() => [
    createStepContent({ component: Example2Step1ContentComponent }),
    createStepContent({ component: Example2Step2ContentComponent }),
    createStepContent({ component: Example2Step3ContentComponent }),
    createStepContent({ component: Example2Step4ContentComponent }),
    createStepContent({ component: Example2Step5ContentComponent }),
    createStepContent({ component: Example2Step6ContentComponent }),
  ]);

  // Map the process steps to their corresponding step contents
  readonly stepsMap = computed(() => {
    const stepData = getStepData(this.formService);
    return new Map(stepData.map((step, index) => [step, this.stepContents()[index]]));
  });
}
