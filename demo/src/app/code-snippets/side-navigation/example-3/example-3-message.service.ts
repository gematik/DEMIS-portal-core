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

import { Injectable, inject } from '@angular/core';
import { NotificationService } from './example-3-notification.service';

@Injectable()
export class MessageService {
  private readonly notificationService = inject(NotificationService);

  showMagicMessage() {
    alert("It's leviosa, not leviosar!");
  }

  showSentMessage() {
    const formData = this.notificationService.getFormData();
    const isValid = this.notificationService.isFormValid();

    const message = isValid
      ? 'The form has been sent successfully!\n\nFormulardaten:\n' + JSON.stringify(formData, null, 2)
      : 'Bitte füllen Sie alle erforderlichen Felder aus!\n\nAktuelle Formulardaten:\n' + JSON.stringify(formData, null, 2);

    alert(message);
  }
}
