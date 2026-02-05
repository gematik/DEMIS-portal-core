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

import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

export type ErrorDialogData = {
  errorTitle: WritableSignal<string>;
  errors: WritableSignal<Error[]>;
};

@Component({
  selector: 'gem-demis-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss',
  imports: [MatIconModule, MatDialogModule, MatDividerModule, MatButtonModule],
})
export class ErrorDialogComponent {
  readonly data = inject<ErrorDialogData>(MAT_DIALOG_DATA);

  get errors() {
    if (this.data) {
      return this.data.errors;
    }

    return signal<Error[]>([]);
  }

  get errorTitle() {
    if (this.data) {
      return this.data.errorTitle;
    }

    return signal<string>('');
  }
}
