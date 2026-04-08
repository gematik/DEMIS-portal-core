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
import { MatButtonModule } from '@angular/material/button';
import { ErrorsDialogProps, MessageDialogService, SeverityEnum } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-message-dialog-example-4',
  imports: [MatButtonModule],
  templateUrl: './example-4.component.html',
})
export class MessageDialogExample4Component {
  private readonly messageDialogService = inject(MessageDialogService);

  showErrorDialog() {
    const errorsDialogProps: ErrorsDialogProps = {
      errorTitle: 'Critical Error',
      errors: [
        {
          text: 'FATAL: Something went terribly wrong. Hopefully, there is a backup disc somewhere.',
          severity: SeverityEnum.FATAL,
        },
        {
          text: 'ERROR: Something went wrong. Please try again later or contact support if the problem persists.',
          severity: SeverityEnum.ERROR,
        },
        {
          text: 'ERROR: An error without severity level is considered as error by default',
        },
        {
          text: 'WARNING: This is just a warning. No need to worry, but you might want to check it out.',
          severity: SeverityEnum.WARNING,
        },
        {
          text: 'INFORMATION: It is raining today',
          severity: SeverityEnum.INFORMATION,
        },
      ],
      logFilteringEnabled: true,
      minSeverityLevel: SeverityEnum.WARNING, //If not set defaults to SeverityEnum.ERROR
    };
    this.messageDialogService.showErrorDialog(errorsDialogProps);
  }
}
