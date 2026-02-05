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

import { Component, computed } from '@angular/core';
import { SideNavigationComponent, createStepContent } from '@gematik/demis-portal-core-library';
import {
  Example1Step1ContentComponent,
  Example1Step2ContentComponent,
  Example1Step3ContentComponent,
  Example1Step4ContentComponent,
  Example1Step5ContentComponent,
  Example1Step6ContentComponent,
} from './example-1-content-components';
import { getStepData } from './example-1.step-data';

@Component({
  selector: 'app-side-navigation-example-1',
  standalone: true,
  imports: [SideNavigationComponent],
  templateUrl: './example-1.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 640px;
      }
    `,
  ],
})
export class SideNavigationExample1Component {
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
   * Example: The inputData for Example1Step2ContentComponent is automatically
   * typed as { message: string }, so TypeScript will catch any typos or wrong properties.
   */
  private readonly stepContents = computed(() => [
    createStepContent({ component: Example1Step1ContentComponent }),
    createStepContent({
      component: Example1Step2ContentComponent,
      inputData: { message: 'Hello from parent component!' },
    }),
    createStepContent({ component: Example1Step3ContentComponent }),
    createStepContent({ component: Example1Step4ContentComponent }),
    createStepContent({ component: Example1Step5ContentComponent }),
    createStepContent({ component: Example1Step6ContentComponent }),
  ]);

  // Map the process steps to their corresponding step contents
  readonly stepsMap = computed(() => {
    const stepData = getStepData();
    return new Map(stepData.map((step, index) => [step, this.stepContents()[index]]));
  });
}
