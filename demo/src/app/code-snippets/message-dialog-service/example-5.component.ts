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
import { ErrorsDialogProps, MessageDialogService } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-message-dialog-example-5',
  imports: [MatButtonModule],
  templateUrl: './example-5.component.html',
})
export class MessageDialogExample5Component {
  private readonly messageDialogService = inject(MessageDialogService);

  showErrorDialog() {
    const errorsDialogProps: ErrorsDialogProps = {
      errorTitle: 'Validation Errors',
      errors: [
        {
          text: 'Multiple issues found in the submitted form:\nField "Name" is required.\nField "Date of Birth" has an invalid format.\nField "Address" exceeds maximum length of 200 characters.',
        },
        {
          text: 'The following resources could not be resolved:\n- Organization/12345\n- Practitioner/67890\n\nPlease verify the referenced identifiers and try again.',
          queryString: 'FHIR resource resolution',
        },
      ],
      clipboardContent:
        'Multiple issues found in the submitted form:\nField "Name" is required.\nField "Date of Birth" has an invalid format.\nField "Address" exceeds maximum length of 200 characters.\n\nThe following resources could not be resolved:\n- Organization/12345\n- Practitioner/67890\n\nPlease verify the referenced identifiers and try again.',
    };
    this.messageDialogService.showErrorDialog(errorsDialogProps);
  }
}
