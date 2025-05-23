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



import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MaxContainerHeightService {
  calculateMaxContainerHeight(elementsToSubtract: Element[] | undefined): string {
    if (!elementsToSubtract) {
      return '100vh';
    }

    const elementHeightsToSubtract = elementsToSubtract.filter(e => e && e.clientHeight).map(e => e.clientHeight);
    if (elementHeightsToSubtract.length > 0) {
      return `calc(100vh - ${elementHeightsToSubtract.join('px - ')}px)`;
    }

    return '100vh';
  }
}
