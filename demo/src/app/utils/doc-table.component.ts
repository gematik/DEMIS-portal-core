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

import { Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MarkdownService } from '@gematik/demis-portal-core-library';

export interface DocTableRowOptions {
  nameIsCode?: boolean;
}

export interface DocTableRowData {
  name: string;
  description: string | string[];
}

@Component({
  selector: 'app-doc-table',
  imports: [MatTableModule],
  providers: [MarkdownService],
  template: `
    <mat-table [dataSource]="dataSource" class="mat-elevation-z1">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
        <mat-cell *matCellDef="let element" [innerHtml]="markdownService.convertToSanitizedHtml(element.name)"></mat-cell>
      </ng-container>

      <!-- Description Column -->
      <ng-container matColumnDef="description">
        <mat-header-cell *matHeaderCellDef> Description </mat-header-cell>
        <mat-cell *matCellDef="let element">
          @if (isArray(element.description)) {
            @for (desc of element.description; track desc) {
              <div [innerHtml]="markdownService.convertToSanitizedHtml(desc)"></div>
            }
          } @else {
            <div [innerHtml]="markdownService.convertToSanitizedHtml(element.description)"></div>
          }
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="['name', 'description']"></mat-header-row>
      <mat-row *matRowDef="let row; columns: ['name', 'description']"></mat-row>
    </mat-table>
  `,
  styles: `
    :host ::ng-deep .mat-mdc-cell p {
      margin-top: 12px;
    }

    .mat-mdc-cell.mat-column-description {
      flex-direction: column;
      align-items: start;
      justify-content: center;
    }
  `,
})
export class DocTableComponent {
  @Input({ required: true }) dataSource!: DocTableRowData[];

  protected readonly markdownService = inject(MarkdownService);

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
