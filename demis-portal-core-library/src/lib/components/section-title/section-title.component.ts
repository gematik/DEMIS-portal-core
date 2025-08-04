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

import { Component, input } from '@angular/core';

// Exportierte Standardwerte für Tests und Produktivcode
export const SECTION_TITLE_DEFAULTS = {
  level: 1 as 1 | 2,
} as const;

@Component({
  selector: 'gem-demis-section-title',
  template: `
    <div [attr.class]="levelClass">
      <h2 id="section-title">
        <span>{{ titleText() }}</span>
      </h2>
      <div id="section-subtitle" class="subtitle-texts">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .gem-demis-section {
        margin-bottom: 16px;
      }

      .gem-demis-section-level-1 {
        h2 {
          font-size: 32px;
          font-weight: 500;
          color: var(--gem-demis-primary-color);
        }

        .subtitle-texts {
          margin-top: 2px;
          font-size: 14px;
          font-weight: 400;
          color: var(--gem-demis-border-color);
        }
      }

      .gem-demis-section-level-2 {
        h2 {
          margin-top: 48px;
          margin-bottom: 0;
          font-size: 20px;
          font-weight: 400;
          color: var(--gem-demis-primary-color);
        }

        .subtitle-texts {
          margin-top: 0;
          font-size: 14px;
          font-weight: 400;
          color: var(--gem-demis-border-color);
        }
      }
    `,
  ],
  standalone: true,
})
export class SectionTitleComponent {
  readonly titleText = input.required<string>();
  readonly level = input<1 | 2>(SECTION_TITLE_DEFAULTS.level);

  get levelClass() {
    return `gem-demis-section gem-demis-section-level-${this.level()}`;
  }
}
