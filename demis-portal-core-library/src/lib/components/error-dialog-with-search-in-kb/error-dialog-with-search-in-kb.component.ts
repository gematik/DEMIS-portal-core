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

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ErrorMessage, ErrorsDialogProps } from '../../services/message-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gem-demis-error-dialog-with-search-in-kb',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatTableModule, MatIconModule],
  templateUrl: './error-dialog-with-search-in-kb.component.html',
  styleUrl: './error-dialog-with-search-in-kb.component.scss',
})
export class ErrorDialogWithSearchInKbComponent {
  private readonly data = inject<ErrorsDialogProps>(MAT_DIALOG_DATA);
  private readonly router = inject(Router);

  readonly dialogRef = inject(MatDialogRef<ErrorDialogWithSearchInKbComponent>);
  private readonly clipboard = inject(Clipboard);
  dataSource: ErrorMessage[];
  clipboardContent?: string;
  errorTitle: string;
  redirectToHome: boolean;

  constructor() {
    this.dataSource = this.data.errors;
    this.clipboardContent = this.data.clipboardContent;
    this.errorTitle = this.data.errorTitle ?? 'Aufgetretene Fehler';
    this.redirectToHome = this.data.redirectToHome ?? false;
  }

  get closeButtonLabel(): string {
    return this.redirectToHome ? 'Zurück zur Hauptseite' : 'Schließen';
  }

  displayedColumns(): string[] {
    return this.atLeastOneErrorHaveQueryString() ? ['text', 'furtherInformation'] : ['text'];
  }

  encodeQueryString(query: string): string {
    return encodeURIComponent(query);
  }

  onCopyErrors(content: string) {
    this.clipboard.copy(content);
  }

  atLeastOneErrorHaveQueryString(): boolean {
    return this.dataSource.some(error => error.queryString);
  }

  async onClose() {
    if (this.redirectToHome) {
      await this.router.navigate(['/']);
    } else {
      this.dialogRef.close();
    }
  }
}
