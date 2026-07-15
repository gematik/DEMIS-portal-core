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
  selector: 'gem-demis-side-navigation-styles',
  imports: [],
  template: `<!-- ONLY USED FOR GLOBAL STYLES! DO NOT EXPORT! -->`,
  styles: `
    gem-demis-side-navigation {
      nav.drawer-sidenav-content {
        gem-demis-section-header .gem-demis-section-header {
          padding: 0px 24px;

          .section-header {
            .section-header-title.section-header-title.section-header-title {
              font-weight: 400;
            }
          }

          .section-header-subtitle {
            color: var(--color-primary);
          }
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None, // <-- Applies styles globally!
})
export class SideNavigationStylesComponent {}
