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

import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FollowUpDialogData, FollowUpNotificationIdService, ValidationStatus } from '../../services/follow-up-notification-id.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput, MatSuffix } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'gem-demis-follow-up-notification-id-dialog',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatLabel,
    MatError,
    NgClass,
    MatInput,
    MatIcon,
    MatSuffix,
  ],
  templateUrl: './follow-up-notification-id-dialog.component.html',
  styleUrl: './follow-up-notification-id-dialog.component.scss',
})
export class FollowUpNotificationIdDialogComponent {
  private readonly router = inject(Router);
  private readonly followUpNotificationIdService = inject(FollowUpNotificationIdService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  // Tracks the last status to only announce on transitions.
  private lastAnnouncedStatus: ValidationStatus | null = null;

  protected readonly key: string = 'initialNotificationIdInput';

  readonly validationStatus = this.followUpNotificationIdService.validationStatus;
  followUpDialogData = inject<FollowUpDialogData>(MAT_DIALOG_DATA);

  initialNotificationIdControl = new FormControl('', [Validators.required]);

  constructor() {
    effect(() => {
      const status = this.validationStatus();

      if (status === ValidationStatus.NOT_FOUND) {
        this.initialNotificationIdControl.setErrors({ invalid: true });
      } else if (status === ValidationStatus.UNSUPPORTED_NOTIFICATION_CATEGORY) {
        this.initialNotificationIdControl.setErrors({ unsupportedNotificationCategory: true });
      } else {
        this.initialNotificationIdControl.setErrors(null);
      }

      // Screenreader feedback: announce success when validation succeeded.
      if (status === ValidationStatus.VALID && this.lastAnnouncedStatus !== ValidationStatus.VALID) {
        this.liveAnnouncer.announce('Meldungs-ID erfolgreich geprüft. Bitte klicken Sie die Enter-Taste oder den Weiter-Button.', 'assertive').then(() => {
          // Keep focus on the primary action. The button is created via @if, so wait until it exists.
          setTimeout(() => {
            const nextBtn = document.getElementById('btn-next') as HTMLButtonElement | null;
            nextBtn?.focus();
          }, 100);
        });
      }

      this.lastAnnouncedStatus = status;
    });
  }

  getValidationStyle() {
    const status = this.validationStatus();
    if (status === ValidationStatus.VALID) {
      return 'valid';
    } else if (status === ValidationStatus.NOT_VALIDATED || !this.initialNotificationIdControl.errors) {
      return 'notvalidated';
    } else if (status === ValidationStatus.NOT_FOUND || status === ValidationStatus.UNSUPPORTED_NOTIFICATION_CATEGORY) {
      return 'invalid';
    }
    return '';
  }

  getInputClass(): string {
    return 'initial-notification-id-input-field-' + this.getValidationStyle();
  }

  validateNotificationId(id: string | null): void {
    if (id) {
      this.followUpNotificationIdService.validateNotificationId(id, this.followUpDialogData.pathToDestinationLookup);
    }
  }

  isTextInputValid() {
    const c = this.initialNotificationIdControl;
    return !!c && c.valid && (c.touched || c.dirty);
  }

  closeDialog(): void {
    this.liveAnnouncer.announce('Dialog geschlossen.', 'assertive').then(() => this.followUpNotificationIdService.closeDialog());
  }

  navigateToWelcomePage() {
    this.closeDialog();
    this.router.navigate(['']).then(() => this.router.navigate(['/welcome']));
  }

  protected readonly ValidationStatus = ValidationStatus;
}
