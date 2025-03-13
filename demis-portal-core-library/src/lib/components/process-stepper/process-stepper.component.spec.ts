/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { ProcessStepperComponent, Step } from './process-stepper.component';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../section-title/section-title.component';

describe('ProcessStepperComponent', () => {
  let component: ProcessStepperComponent;
  let fixture: MockedComponentFixture<ProcessStepperComponent, ProcessStepperComponent>;

  beforeEach(() => MockBuilder([ProcessStepperComponent, SectionTitleComponent]).mock(CommonModule).mock(MatIconModule));

  it('should create the component', () => {
    fixture = MockRender(ProcessStepperComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have the correct title text', () => {
    fixture = MockRender(ProcessStepperComponent);
    component = fixture.point.componentInstance;
    const titleText = 'Test Title';
    component.titleText = titleText;
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('#section-title');
    expect(titleElement.textContent).toContain(titleText);
  });

  it('should have the correct subtitle text', () => {
    fixture = MockRender(ProcessStepperComponent);
    component = fixture.point.componentInstance;
    const subtitleText = 'Test Subtitle';
    component.subtitleText = subtitleText;
    fixture.detectChanges();
    const subtitleElement = fixture.nativeElement.querySelector('#section-subtitle');
    expect(subtitleElement.textContent).toContain(subtitleText);
  });

  it('should have the correct number of steps and  active step', () => {
    const steps: Step[] = [
      { number: 1, title: 'Step 1', description: 'Description 1' },
      { number: 2, title: 'Step 2', description: 'Description 2' },
      { number: 3, title: 'Step 3', description: 'Description 3' },
    ];
    fixture = MockRender(ProcessStepperComponent);
    fixture.componentInstance.steps = steps;
    fixture.componentInstance.activeStep = steps[1];
    component = fixture.point.componentInstance;
    fixture.detectChanges();
    const stepElements = ngMocks.findAll('.process-step');
    expect(stepElements.length).toBe(steps.length);
    const activeStepElement = fixture.nativeElement.querySelector('.active-step');
    expect(activeStepElement.textContent).toContain(steps[1].title);
  });
});
