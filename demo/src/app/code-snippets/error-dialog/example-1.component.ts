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

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorsDialogProps, MessageDialogService } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-error-dialog-example-1',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './example-1.component.html',
})
export class ErrorDialogExample1Component {
  private readonly messageDialogService = inject(MessageDialogService);

  showError() {
    const errorsDialogProps: ErrorsDialogProps = {
      errorTitle: 'Critical Error',
      errors: [
        {
          text: 'Something went terribly wrong. Hopefully, there is a backup disc somewhere.',
        },
      ],
    };
    this.messageDialogService.showErrorDialog(errorsDialogProps);
  }
}
