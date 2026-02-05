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

import { Component, inject } from '@angular/core';
import { MessageDialogService, SpinnerDialogProps } from '@gematik/demis-portal-core-library';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-message-dialog-example-3',
  imports: [MatButton],
  templateUrl: './example-3.component.html',
})
export class MessageDialogExample3Component {
  private readonly messageDialogService = inject(MessageDialogService);

  isSpinnerOpen = false;

  openSpinnerDialog(): void {
    const data: SpinnerDialogProps = {
      message: 'Meldung wird verarbeitet',
    };

    this.messageDialogService.showSpinnerDialog(data);
    this.isSpinnerOpen = true;

    // Auto-close after 5 seconds for demo convenience
    setTimeout(() => {
      if (this.isSpinnerOpen) {
        this.closeSpinnerDialog();
      }
    }, 5000);
  }

  closeSpinnerDialog(): void {
    this.messageDialogService.closeSpinnerDialog();
    this.isSpinnerOpen = false;
  }
}
