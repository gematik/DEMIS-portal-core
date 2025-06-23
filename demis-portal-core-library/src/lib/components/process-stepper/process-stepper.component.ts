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

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../section-title/section-title.component';

export declare type Step = {
  number: number;
  title: string;
  description: string;
};

@Component({
  selector: 'gem-demis-process-stepper',
  templateUrl: './process-stepper.component.html',
  styleUrl: './process-stepper.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule, SectionTitleComponent],
})
export class ProcessStepperComponent {
  @Input({ required: true }) titleText!: string;
  @Input() subtitleText?: string;
  @Input({ required: true }) steps!: Step[];
  @Input({ required: true }) activeStep!: Step;
}
