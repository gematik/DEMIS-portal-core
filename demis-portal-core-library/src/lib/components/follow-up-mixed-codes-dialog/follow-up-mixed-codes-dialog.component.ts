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

import { Component, computed, inject, model, Signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { customCodeDisplay } from '../../formly/commons';
import { FormsModule } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { FollowUpMixedCodesService } from '../../services/follow-up-mixed-codes.service';

@Component({
  selector: 'gem-demis-follow-up-mixed-codes-dialog',
  imports: [MatDialogTitle, MatButton, MatDialogActions, MatRadioGroup, MatRadioButton, FormsModule],
  templateUrl: './follow-up-mixed-codes-dialog.component.html',
  styleUrl: './follow-up-mixed-codes-dialog.component.scss',
})
export class FollowUpMixedCodesDialogComponent {
  private readonly followUpMixedCodesService = inject(FollowUpMixedCodesService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly router = inject(Router);

  notificationCategories = inject<customCodeDisplay[]>(MAT_DIALOG_DATA);
  selectedValue: WritableSignal<string | undefined> = model(undefined);
  nextButtonDisabled: Signal<boolean> = computed(() => !this.selectedValue());

  navigateToWelcomePage() {
    this.closeDialog();
    this.router.navigate(['']).then(() => this.router.navigate(['/welcome']));
  }

  closeDialog(): void {
    this.liveAnnouncer.announce('Dialog geschlossen.', 'assertive').then(() => this.followUpMixedCodesService.closeDialog(this.selectedValue()));
  }
}
