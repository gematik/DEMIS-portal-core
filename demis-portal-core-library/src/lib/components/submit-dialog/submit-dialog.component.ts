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

import { Component, inject, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SubmitDialogProps } from '../../services/message-dialog.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'gem-demis-submit-dialog',
  imports: [MatDialogTitle, MatIcon, MatDialogContent, MatButton, MatDialogClose, MatDialogActions],
  templateUrl: './submit-dialog.component.html',
  styleUrl: './submit-dialog.component.scss',
})
export class SubmitDialogComponent {
  private readonly data = inject<SubmitDialogProps>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SubmitDialogComponent>);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pdfDownloadUrl: string | null;
  notificationId: string;
  timestamp: string;
  fileName: string;
  authorEmail: string;
  href: string;

  constructor() {
    this.notificationId = this.data.notificationId;
    this.timestamp = this.data.timestamp;
    this.fileName = this.data.fileName;
    this.href = this.data.href;
    this.authorEmail = this.data.authorEmail;

    this.pdfDownloadUrl = this.sanitizer.sanitize(SecurityContext.URL, this.data.href);
    this.triggerDownload(this.data.href, this.data.fileName);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
    this.dialogRef.close();
  }

  private triggerDownload(url: string, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
