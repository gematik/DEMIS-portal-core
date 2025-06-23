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

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogData } from '../components/error-dialog/error-dialog.component';
import { ErrorDialogWithSearchInKbComponent } from '../components/error-dialog-with-search-in-kb/error-dialog-with-search-in-kb.component';

export interface ErrorsDialogProps {
  errors: ErrorMessage[];
  clipboardContent?: string;
  errorTitle?: string;
  redirectToHome?: boolean;
}

export interface ErrorMessage {
  text: string;
  queryString?: string;
}

export interface ErrorDialogStyle {
  height?: string;
  width?: string;
  maxWidth?: string;
}

export const ErrorDialogInsertDataFromClipboard: ErrorsDialogProps = {
  errorTitle: 'Fehler bei der Datenübernahme',
  errors: [
    {
      text: 'Diese Daten werden aus der Zwischenablage importiert. Bitte wenden Sie sich an Ihre IT zur Konfiguration des Datenimports.',
      queryString: 'Übergabe von Daten aus dem Primärsystem',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class MessageDialogService {
  private matDialog = inject(MatDialog);

  /**
   * @deprecated Use `showErrorDialog` instead.
   */
  error(data: ErrorDialogData): void {
    this.matDialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, { data });
  }

  showErrorDialog(data: ErrorsDialogProps, style?: ErrorDialogStyle): void {
    this.matDialog.open(ErrorDialogWithSearchInKbComponent, {
      data: data,
      height: style?.height || '600px',
      width: style?.width || '800px',
      maxWidth: style?.maxWidth || '800px',
      disableClose: data.redirectToHome ?? false,
    });
  }

  extractMessageFromError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error?.error === 'string') {
      return error.error;
    }
    return error?.error?.message ?? error?.message ?? 'Unbekannter Fehler';
  }

  /**
   * The error dialog for the case that an error occurs while data is inserted from clipboard.
   * This should ensure that all micro-frontends are using the same error dialog for this use case.
   */
  showErrorDialogInsertDataFromClipboard(): void {
    this.showErrorDialog(ErrorDialogInsertDataFromClipboard);
  }
}
