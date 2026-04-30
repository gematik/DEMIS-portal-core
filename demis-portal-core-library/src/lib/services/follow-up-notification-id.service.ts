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

import { inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { toObservable } from '@angular/core/rxjs-interop';
import { FollowUpNotificationIdDialogComponent } from '../components/follow-up-notification-id-dialog/follow-up-notification-id-dialog.component';
import { FhirCoreNotificationService, FollowUpNotificationCategory } from './fhir-core-notification.service';

export enum ValidationStatus {
  VALID = 'VALID',
  NOT_FOUND = 'NOT_FOUND',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

export interface FollowUpDialogData {
  routerLink: string;
  linkTextContent: string;
  pathToDestinationLookup: string;
}

export interface FollowUpServiceDialogData {
  dialogData: FollowUpDialogData;
}

@Injectable({
  providedIn: 'root',
})
export class FollowUpNotificationIdService {
  private readonly dialog = inject(MatDialog);
  private readonly fhirCoreNotificationService = inject(FhirCoreNotificationService);

  readonly validatedNotificationId = signal<string | undefined>(undefined);
  readonly validationStatus = signal<ValidationStatus>(ValidationStatus.NOT_VALIDATED);
  readonly hasValidNotificationId = signal<boolean | undefined>(false);
  readonly followUpNotificationCategory = signal<string | undefined>(undefined);

  readonly hasValidNotificationId$ = toObservable(this.hasValidNotificationId);

  private dialogRef: MatDialogRef<FollowUpNotificationIdDialogComponent> | null = null;

  openDialog(followUpServiceDialogData: FollowUpServiceDialogData): void {
    if (this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(FollowUpNotificationIdDialogComponent, {
      disableClose: true,
      ariaModal: true,
      ariaLabelledBy: 'dialog-title',
      ariaDescribedBy: 'dialog-paragraph',
      data: followUpServiceDialogData.dialogData,
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  validateNotificationId(id: string, pathToDestinationLookup: string): void {
    this.validationStatus.set(ValidationStatus.NOT_VALIDATED);
    this.fhirCoreNotificationService.fetchFollowUpNotificationCategory(id, pathToDestinationLookup).subscribe({
      next: (response: FollowUpNotificationCategory) => {
        this.setValidState(id, response.notificationCategory);
      },
      error: () => {
        this.setInvalidState(ValidationStatus.NOT_FOUND);
      },
    });
  }

  private setValidState(id: string, notificationCategory: string): void {
    this.validationStatus.set(ValidationStatus.VALID);
    this.validatedNotificationId.set(id);
    this.followUpNotificationCategory.set(notificationCategory);
    this.hasValidNotificationId.set(true);
  }

  private setInvalidState(status: ValidationStatus): void {
    this.validationStatus.set(status);
    this.validatedNotificationId.set(undefined);
    this.followUpNotificationCategory.set(undefined);
  }

  resetState(): void {
    this.validatedNotificationId.set(undefined);
    this.validationStatus.set(ValidationStatus.NOT_VALIDATED);
  }
}
