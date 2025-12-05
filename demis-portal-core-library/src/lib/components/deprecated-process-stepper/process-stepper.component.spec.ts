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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { ProcessStepperComponent, Step } from './process-stepper.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../section-title/section-title.component';

describe('ProcessStepperComponent', () => {
  beforeEach(() => MockBuilder(ProcessStepperComponent).keep(SectionTitleComponent).mock(CommonModule).mock(MatIconModule));

  it('should create the component', () => {
    const steps: Step[] = [{ number: 1, title: 'Step 1', description: 'Description 1' }];
    const fixture = MockRender(ProcessStepperComponent, {
      titleText: 'Test Title',
      steps: steps,
      activeStep: steps[0],
    });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have the correct title text', () => {
    const steps: Step[] = [{ number: 1, title: 'Step 1', description: 'Description 1' }];
    const titleText = 'Test Title';
    const fixture = MockRender(ProcessStepperComponent, {
      titleText: titleText,
      steps: steps,
      activeStep: steps[0],
    });
    fixture.detectChanges();
    const titleElement = fixture.point.nativeElement.querySelector('#section-title');
    expect(titleElement.textContent).toContain(titleText);
  });

  it('should have the correct subtitle text', () => {
    const steps: Step[] = [{ number: 1, title: 'Step 1', description: 'Description 1' }];
    const subtitleText = 'Test Subtitle';
    const fixture = MockRender(ProcessStepperComponent, {
      titleText: 'Test Title',
      subtitleText: subtitleText,
      steps: steps,
      activeStep: steps[0],
    });
    fixture.detectChanges();
    const subtitleElement = fixture.point.nativeElement.querySelector('#section-subtitle');
    expect(subtitleElement.textContent).toContain(subtitleText);
  });

  it('should have the correct number of steps and active step', () => {
    const steps: Step[] = [
      { number: 1, title: 'Step 1', description: 'Description 1' },
      { number: 2, title: 'Step 2', description: 'Description 2' },
      { number: 3, title: 'Step 3', description: 'Description 3' },
    ];
    const fixture = MockRender(ProcessStepperComponent, {
      titleText: 'Test Title',
      steps: steps,
      activeStep: steps[1],
    });
    fixture.detectChanges();
    const stepElements = fixture.point.nativeElement.querySelectorAll('.process-step');
    expect(stepElements.length).toBe(steps.length);
    const activeStepElement = fixture.point.nativeElement.querySelector('.active-step');
    expect(activeStepElement.textContent).toContain(steps[1].title);
  });
});
