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

import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NGXLogger } from 'ngx-logger';

// Exportierte Standardwerte für Tests und Produktivcode
export const FILE_SELECT_DEFAULTS = {
  displayText: 'Wählen Sie eine Datei aus',
  acceptedFileTypes: '*/*',
  multipleFilesSelectable: false,
} as const;

@Component({
  selector: 'gem-demis-file-select',
  templateUrl: './file-select.component.html',
  styleUrl: './file-select.component.scss',
  imports: [MatIconModule],
})
export class FileSelectComponent {
  readonly displayText = input<string>(FILE_SELECT_DEFAULTS.displayText);
  readonly acceptedFileTypes = input<string>(FILE_SELECT_DEFAULTS.acceptedFileTypes);
  readonly multipleFilesSelectable = input<boolean>(FILE_SELECT_DEFAULTS.multipleFilesSelectable);

  readonly onFileSelected = output<FileList | null>();
  private readonly logger = inject(NGXLogger);

  onChange(event: Event) {
    const input = event?.target;
    if (!(!!input && input instanceof HTMLInputElement && !!input.files)) {
      this.logger.error('no file selected');
      this.onFileSelected.emit(null);
      return;
    }
    this.logger.debug('got a FileList', input.files);
    this.onFileSelected.emit(input.files);
    input.value = '';
  }
}
