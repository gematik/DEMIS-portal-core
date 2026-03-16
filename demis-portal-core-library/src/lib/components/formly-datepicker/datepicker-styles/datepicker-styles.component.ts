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

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gem-demis-util-datepicker-styles',
  template: `<!-- ONLY USED FOR GLOBAL STYLES! DO NOT EXPORT! -->`,
  styles: `
    .gem-demis-formly-datepicker-body {
      /* Make all views for the different precisions the same panel height. */
      min-height: 395px;
    }

    /* This is a temporary workaround until we have a central solution for
       spacing within our forms. That is most likely to happen with DEMIS-4770.
       Once this ticket is resolved, this workaround shall be removed. */
    .mat-mdc-form-field:has(gem-demis-datepicker) {
      margin-bottom: 1rem;
    }
  `,
  encapsulation: ViewEncapsulation.None, // <-- Applies styles globally!
})
export class DatepickerStylesComponent {}
