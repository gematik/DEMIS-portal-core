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

import { Component, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gem-demis-file-select',
  templateUrl: './file-select.component.html',
  styleUrl: './file-select.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class FileSelectComponent {
  @Input() displayText: string = 'Wählen Sie eine Datei aus';
  @Input() acceptedFileTypes: string = '*/*';
  @Input() multipleFilesSelectable: boolean = false;
  private readonly fileSelectionChanged = new BehaviorSubject<FileList | null>(null);
  @Output() onFileSelected = this.fileSelectionChanged.asObservable();
  private readonly logger = inject(NGXLogger);

  onChange(event: Event) {
    const input = event?.target;
    if (!(!!input && input instanceof HTMLInputElement && !!input.files)) {
      this.logger.error('no file selected');
      return;
    }
    this.logger.debug('got a FileList', input.files);
    this.fileSelectionChanged.next(input.files);
    input.value = '';
  }
}
