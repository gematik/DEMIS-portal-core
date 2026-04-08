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

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogData } from '../components/error-dialog/error-dialog.component';
import { ErrorDialogWithSearchInKbComponent } from '../components/error-dialog-with-search-in-kb/error-dialog-with-search-in-kb.component';
import { SubmitDialogComponent } from '../components/submit-dialog/submit-dialog.component';
import { SpinnerDialogComponent } from '../components/spinner-dialog/spinner-dialog.component';

export interface ErrorsDialogProps {
  errors: ErrorMessage[];
  clipboardContent?: string;
  errorTitle?: string;
  redirectToHome?: boolean;
  // Even though logFilteringEnabled and minSeverityLevel belong together, they are kept separate because
  // logFilteringEnabled is only required as long as we use the feature flag FEATURE_FLAG_PORTAL_ERROR_DIALOG_FILTERING
  // Props can be consolidated once FEATURE_FLAG_PORTAL_ERROR_DIALOG_FILTERING is removed.
  logFilteringEnabled?: boolean;
  minSeverityLevel?: SeverityEnum;
}

export enum SeverityEnum {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  INFORMATION = 'information',
}

const severityRank: Record<SeverityEnum, number> = {
  [SeverityEnum.FATAL]: 4,
  [SeverityEnum.ERROR]: 3,
  [SeverityEnum.WARNING]: 2,
  [SeverityEnum.INFORMATION]: 1,
};

export interface ErrorMessage {
  text: string;
  queryString?: string;
  severity?: SeverityEnum;
}

export interface DialogStyle {
  height?: string;
  width?: string;
  maxWidth?: string;
}

export interface SubmitDialogProps {
  notificationId: string;
  timestamp: string;
  fileName: string;
  href: string;
  authorEmail: string;
}

export interface SpinnerDialogProps {
  message: string;
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
  private readonly matDialog = inject(MatDialog);
  private spinnerDialogRef: any = null;

  /**
   * @deprecated Use `showErrorDialog` instead.
   */
  error(data: ErrorDialogData): void {
    this.matDialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, { data });
  }

  showErrorDialog(data: ErrorsDialogProps, style?: DialogStyle): void {
    const dialogData = data.logFilteringEnabled
      ? {
          ...data,
          errors: this.filterBySeverityLevel(data),
        }
      : data;

    this.matDialog.open(ErrorDialogWithSearchInKbComponent, {
      data: data.logFilteringEnabled ? dialogData : data,
      height: style?.height ?? '600px',
      width: style?.width ?? '800px',
      maxWidth: style?.maxWidth ?? '800px',
      disableClose: dialogData.redirectToHome ?? false,
    });
  }

  private normalizeSeverity(value: unknown): SeverityEnum {
    return Object.values(SeverityEnum).includes(value as SeverityEnum) ? (value as SeverityEnum) : SeverityEnum.ERROR;
  }

  private filterBySeverityLevel(data: ErrorsDialogProps): ErrorMessage[] {
    const threshold = this.normalizeSeverity(data.minSeverityLevel);

    return data.errors.filter(error => {
      const severity = this.normalizeSeverity(error.severity);
      return severityRank[severity] >= severityRank[threshold];
    });
  }

  showSubmitDialog(data: SubmitDialogProps, style?: DialogStyle): void {
    this.matDialog.open(SubmitDialogComponent, {
      data: data,
      height: style?.height ?? '385px',
      width: style?.width ?? '610px',
      disableClose: true,
    });
  }

  showSpinnerDialog(data: SpinnerDialogProps, style?: DialogStyle): void {
    this.spinnerDialogRef = this.matDialog.open(SpinnerDialogComponent, {
      data: data,
      height: style?.height ?? '300px',
      width: style?.width ?? '350px',
      disableClose: true,
    });
  }

  closeSpinnerDialog(): void {
    if (this.spinnerDialogRef) {
      this.spinnerDialogRef.close();
      this.spinnerDialogRef = null;
    }
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
