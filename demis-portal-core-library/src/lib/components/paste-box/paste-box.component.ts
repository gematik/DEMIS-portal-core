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

import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MessageDialogService } from '../../services/message-dialog.service';
import { NGXLogger } from 'ngx-logger';

export const DEMIS_PASTE_BOX_CLIPBOARD_ERROR = {
  errorTitle: 'Fehler bei der Datenübernahme',
  errors: [
    {
      text: 'Es konnten keine verwendbaren Daten aus der Zwischenablage importiert werden. Bitte wenden Sie sich an Ihre IT zur Konfiguration des Datenimports.',
      queryString: 'Übergabe von Daten aus dem Primärsystem',
    },
  ],
};

@Component({
  selector: 'gem-demis-paste-box',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './paste-box.component.html',
  styleUrls: ['./paste-box.component.scss'],
})
export class PasteBoxComponent {
  readonly dataPasted = output<Map<string, string>>();
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly logger = inject(NGXLogger);

  readFromClipboard() {
    navigator.clipboard
      .readText()
      .then(clipboardContent => {
        const parsedClipboardData = this.parseClipboardData(clipboardContent);
        if (parsedClipboardData.size === 0) {
          throw new Error('The clipboard is empty or contains no parsable data.'); // internal error message, hence, in English
        }
        this.dataPasted.emit(parsedClipboardData);
      })
      .catch((err: any) => {
        this.logger.error('Clipboard read failed: ', err);
        this.messageDialogService.showErrorDialog(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
      })
      .finally(() => navigator.clipboard.writeText(''));
  }

  private parseClipboardData(clipboardData: string): Map<string, string> {
    const decodedClipboardData = decodeURIComponent(clipboardData);
    const clipboardMap = new Map<string, string>();
    const regExp = /^URL .*/;
    if (regExp.test(decodedClipboardData)) {
      const keyValuePairs = decodedClipboardData.replace(/^URL /, '').split('&');
      keyValuePairs.forEach(kvp => {
        if (kvp.includes('=')) {
          const [key, value] = kvp.split('=');
          if (key && value) {
            clipboardMap.set(key, value);
          }
        }
      });
    }
    return clipboardMap;
  }
}
