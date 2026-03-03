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
import { FollowUpMixedCodesDialogComponent } from '../components/follow-up-mixed-codes-dialog/follow-up-mixed-codes-dialog.component';
import { customCodeDisplay } from '../formly/commons';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowUpMixedCodesService {
  private readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<FollowUpMixedCodesDialogComponent> | null = null;
  selectedValue = signal<string | undefined>(undefined);

  openDialog(notificationCategories: customCodeDisplay[]): Observable<string | undefined> {
    if (this.dialogRef) {
      return this.dialogRef.afterClosed();
    }

    this.dialogRef = this.dialog.open(FollowUpMixedCodesDialogComponent, {
      disableClose: true,
      ariaModal: true,
      ariaLabelledBy: 'dialog-title',
      ariaDescribedBy: 'dialog-paragraph',
      data: notificationCategories,
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });

    return this.dialogRef.afterClosed();
  }

  closeDialog(result?: string): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
  }
}
