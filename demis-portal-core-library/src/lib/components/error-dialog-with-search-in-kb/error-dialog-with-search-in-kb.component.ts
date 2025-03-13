/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ErrorMessage, ErrorsDialogProps } from '../../services/message-dialog.service';

@Component({
  selector: 'gem-demis-error-dialog-with-search-in-kb',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatTableModule, MatIconModule],
  templateUrl: './error-dialog-with-search-in-kb.component.html',
  styleUrl: './error-dialog-with-search-in-kb.component.scss',
})
export class ErrorDialogWithSearchInKbComponent {
  readonly dialogRef = inject(MatDialogRef<ErrorDialogWithSearchInKbComponent>);
  private readonly clipboard = inject(Clipboard);
  dataSource: ErrorMessage[];
  clipboardContent?: string;
  errorTitle: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorsDialogProps) {
    this.dataSource = data.errors;
    this.clipboardContent = data.clipboardContent;
    this.errorTitle = data.errorTitle || 'Aufgetretene Fehler';
  }

  displayedColumns(): string[] {
    return this.atLeastOneErrorHaveQueryString() ? ['text', 'furtherInformation'] : ['text'];
  }

  encodeQueryString(query: string): string {
    return encodeURIComponent(query);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCopyErrors() {
    this.clipboard.copy(this.clipboardContent || '');
  }

  atLeastOneErrorHaveQueryString(): Boolean {
    return this.dataSource.some(error => error.queryString);
  }
}
