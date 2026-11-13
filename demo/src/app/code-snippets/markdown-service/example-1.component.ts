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

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkdownService } from '@gematik/demis-portal-core-library';

@Component({
  selector: 'app-markdown-example-1',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './example-1.component.html',
  styles: `
    :host {
      display: block;
      min-width: 0;
    }

    mat-form-field {
      width: 100%;
    }

    textarea {
      font-family: monospace;
      resize: vertical;
    }

    :host > h3 {
      margin: 24px 0 12px;
    }

    .markdown-preview,
    pre {
      box-sizing: border-box;
      min-height: 64px;
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.24);
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.025);
      overflow-wrap: anywhere;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
    }
  `,
})
export class MarkdownExample1Component {
  private readonly markdownService = inject(MarkdownService);

  readonly markdown = signal(`## Notification summary

This notification is **ready for review**. Please check the *required information*.

- Patient details
- Laboratory findings

[DEMIS](https://www.demis.rki.de/)

Use \`convertToSanitizedHtml(markdown)\` to render this text.

<strong onclick="alert('Unsafe event handler')">This text remains, but its event handler is removed.</strong>`);

  readonly sanitizedHtml = computed(() => this.markdownService.convertToSanitizedHtml(this.markdown()));
}
