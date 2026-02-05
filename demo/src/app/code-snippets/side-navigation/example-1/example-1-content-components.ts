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

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StepContentComponent, StepNavigationService } from '@gematik/demis-portal-core-library';

/**
 * Input data structure for step 2 to demonstrate data passing.
 */
export interface Step2Input {
  message: string;
}

@Component({
  selector: 'app-example-1-step1-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step1-content.component.html',
})
export class Example1Step1ContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-1-step2-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step2-content.component.html',
})
export class Example1Step2ContentComponent extends StepContentComponent<Step2Input> {
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-1-step3-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step3-content.component.html',
})
export class Example1Step3ContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-1-step4-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step4-content.component.html',
})
export class Example1Step4ContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-1-step5-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step5-content.component.html',
})
export class Example1Step5ContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-1-step6-content',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1-step6-content.component.html',
})
export class Example1Step6ContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigationService);
}
