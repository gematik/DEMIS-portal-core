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

import { Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { MatButtonModule } from '@angular/material/button';

// Exportierte Standardwerte für Tests und Produktivcode
export const FILE_NAME_CHIP_DEFAULTS = {
  canDelete: true,
} as const;

@Component({
  selector: 'gem-demis-file-name-chip',
  templateUrl: './file-name-chip.component.html',
  styleUrl: './file-name-chip.component.scss',
  imports: [MatChipsModule, MatIconModule, MatButtonModule, FileSizePipe],
})
export class FileNameChipComponent {
  readonly fileName = input.required<string>();
  readonly fileSize = input<number>();
  canDelete = input<boolean>(FILE_NAME_CHIP_DEFAULTS.canDelete);
  readonly fileDeleted = output<void>();

  onDeleteClicked() {
    if (this.canDelete()) {
      this.fileDeleted.emit(undefined);
    }
  }
}
