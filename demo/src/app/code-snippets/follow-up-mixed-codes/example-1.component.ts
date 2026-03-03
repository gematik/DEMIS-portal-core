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

import { Component, inject } from '@angular/core';
import { FollowUpMixedCodesService } from '../../../../../demis-portal-core-library/src/lib/services/follow-up-mixed-codes.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-follow-up-mixed-codes-example-1',
  standalone: true,
  imports: [MatButton],
  templateUrl: './example-1.component.html',
})
export class FollowUpMixedCodesExample1Component {
  private readonly followUpMixedService = inject(FollowUpMixedCodesService);

  mixedCodesList = [
    { code: 'invp', display: 'Influenzavirus' },
    { code: 'tubk', display: 'Tuberkulosebakterium' },
  ];

  showFollowUpMixedCodesDialog() {
    this.followUpMixedService.openDialog(this.mixedCodesList);
  }
}
