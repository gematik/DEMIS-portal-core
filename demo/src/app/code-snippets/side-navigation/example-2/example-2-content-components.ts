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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StepContentComponent, StepNavigationService } from '@gematik/demis-portal-core-library';
import { FormService } from './example-2-form.service';
import { MessageService } from './example-2-message.service';

@Component({
  selector: 'app-example-2-step1-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step1-content.component.html',
})
export class Example2Step1ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}

@Component({
  selector: 'app-example-2-step2-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step2-content.component.html',
})
export class Example2Step2ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}

@Component({
  selector: 'app-example-2-step3-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step3-content.component.html',
})
export class Example2Step3ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}

@Component({
  selector: 'app-example-2-step4-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step4-content.component.html',
})
export class Example2Step4ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}

@Component({
  selector: 'app-example-2-step5-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step5-content.component.html',
})
export class Example2Step5ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}

@Component({
  selector: 'app-example-2-step6-content',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './example-2-step6-content.component.html',
})
export class Example2Step6ContentComponent extends StepContentComponent<void> {
  protected formService = inject(FormService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}
