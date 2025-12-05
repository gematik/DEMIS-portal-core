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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorsDialogProps, MessageDialogService, SubmitDialogProps } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-message-dialog-example-2',
  imports: [MatButtonModule],
  templateUrl: './example-2.component.html',
})
export class MessageDialogExample2Component {
  private readonly messageDialogService = inject(MessageDialogService);

  showSubmit() {
    const submitDialogProps: SubmitDialogProps = {
      notificationId: '73d38849-fcb7-4d65-bce0-a7c36eb1b9e8',
      timestamp: '06.08.2025 16:05:26',
      fileName: '250806160616 Power, Max 250806',
      href: '',
      authorEmail: 'demis-support@rki.de',
    };
    this.messageDialogService.showSubmitDialog(submitDialogProps);
  }
}
