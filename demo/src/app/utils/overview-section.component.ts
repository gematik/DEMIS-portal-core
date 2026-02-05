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

import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-overview-section',
  imports: [MatExpansionModule],
  template: `
    <mat-expansion-panel [(expanded)]="expanded" class="outlined-panel" (opened)="onExpanded()" (closed)="onCollapsed()">
      <mat-expansion-panel-header>
        <mat-panel-title>Overview</mat-panel-title>
      </mat-expansion-panel-header>

      <ng-content></ng-content>
    </mat-expansion-panel>
  `,
  styles: `
    .outlined-panel {
      margin-bottom: 16px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      box-shadow: none;

      &.mat-expanded mat-expansion-panel-header {
        margin-bottom: 16px;
      }
    }
  `,
})
export class OverviewSectionComponent implements OnInit {
  expanded = true;

  private readonly overviewSectionCollapsedKey = 'OVERVIEW_SECTION_COLLAPSED';

  ngOnInit(): void {
    const isCollapsed = sessionStorage.getItem(this.overviewSectionCollapsedKey);
    this.expanded = !isCollapsed;
  }

  onExpanded(): void {
    sessionStorage.removeItem(this.overviewSectionCollapsedKey);
  }

  onCollapsed(): void {
    sessionStorage.setItem(this.overviewSectionCollapsedKey, '1');
  }
}
