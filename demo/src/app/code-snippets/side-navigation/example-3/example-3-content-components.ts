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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { StepContentComponent, StepNavigationService } from '@gematik/demis-portal-core-library';
import { NotificationService } from './example-3-notification.service';
import { MessageService } from './example-3-message.service';
import { FieldConfigService } from './example-3-field-config.service';

/**
 * Input data structure for the Notified Person step content component.
 */
export interface NotifiedPersonInput {
  magicSpell: string;
}

@Component({
  selector: 'app-example-3-notifying-person-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-notifying-person-content.component.html',
})
export class Example3NotifyingPersonContentComponent extends StepContentComponent<void> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-3-notified-person-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-notified-person-content.component.html',
})
export class Example3NotifiedPersonContentComponent extends StepContentComponent<NotifiedPersonInput> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-3-disease-choice-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-disease-choice-content.component.html',
})
export class Example3DiseaseChoiceContentComponent extends StepContentComponent<void> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-3-condition-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-condition-content.component.html',
})
export class Example3ConditionContentComponent extends StepContentComponent<void> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);

  // Computed property to decide which fields to show based on disease choice
  readonly fieldsToShow = computed(() => {
    const diseaseValue = this.notificationService.diseaseChoiceGroup.get('disease')?.value;
    return diseaseValue === 'Erkältung' ? this.fieldConfig.conditionRadioFields : this.fieldConfig.conditionFields;
  });
}

@Component({
  selector: 'app-example-3-common-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-common-content.component.html',
})
export class Example3CommonContentComponent extends StepContentComponent<void> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);
}

@Component({
  selector: 'app-example-3-questionnaire-content',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule],
  templateUrl: './example-3-questionnaire-content.component.html',
})
export class Example3QuestionnaireContentComponent extends StepContentComponent<void> {
  protected notificationService = inject(NotificationService);
  protected fieldConfig = inject(FieldConfigService);
  protected navigation = inject(StepNavigationService);
  protected messageService = inject(MessageService);
}
