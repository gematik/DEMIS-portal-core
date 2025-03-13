/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { Component, Input } from '@angular/core';

@Component({
  selector: 'gem-demis-section-title',
  template: `
    <div [attr.class]="levelClass">
      <h2 id="section-title">
        <span>{{ titleText }}</span>
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
  @Input({ required: true }) titleText!: string;
  @Input() level: 1 | 2 = 1;

  get levelClass() {
    return `gem-demis-section gem-demis-section-level-${this.level}`;
  }
}
