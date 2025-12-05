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

import { Component, OnInit, signal } from '@angular/core';
import { PasteBoxComponent } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-paste-box-example-1',
  imports: [PasteBoxComponent],
  templateUrl: './example-1.component.html',
})
export class PasteBoxExample1Component implements OnInit {
  private isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  canReadFromClipboard = signal(false);

  ngOnInit(): void {
    if (this.isFirefox) {
      this.canReadFromClipboard.set(!!navigator.clipboard.readText);
      return;
    }

    // Check if the browser supports the Clipboard API
    navigator.permissions
      .query({ name: 'clipboard-read' as PermissionName })
      .then(permissionStatus => {
        this.canReadFromClipboard.set(permissionStatus.state === 'granted');
        permissionStatus.onchange = () => {
          this.canReadFromClipboard.set(permissionStatus.state === 'granted');
        };
      })
      .catch(err => {
        this.canReadFromClipboard.set(false);
        console.error('Clipboard permission not granted', err);
      });
  }

  onDataPasted(parsedData: Map<string, string>) {
    const mapAsString = Array.from(parsedData)
      .map(([key, value]) => `[${key}: ${value}]`)
      .join(', ');
    alert(`Parsed data pasted from clipboard: [${mapAsString}]`);
  }
}
