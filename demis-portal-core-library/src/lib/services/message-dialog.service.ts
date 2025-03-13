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



import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogData } from '../components/error-dialog/error-dialog.component';
import { ErrorDialogWithSearchInKbComponent } from '../components/error-dialog-with-search-in-kb/error-dialog-with-search-in-kb.component';

export interface ErrorsDialogProps {
  errors: ErrorMessage[];
  clipboardContent?: string;
  errorTitle?: string;
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

@Injectable({ providedIn: 'root' })
export class MessageDialogService {
  private matDialog = inject(MatDialog);

  error(data: ErrorDialogData): void {
    this.matDialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, { data });
  }

  errorWithSearch(data: ErrorsDialogProps, style?: ErrorDialogStyle): void {
    this.matDialog.open(ErrorDialogWithSearchInKbComponent, {
      data: data,
      height: style?.height || '600px',
      width: style?.width || '800px',
      maxWidth: style?.maxWidth || '800px',
    });
  }
}
