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

import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetBoxComponent } from './code-snippet-box.component';

export interface CodeSnippet {
  fileName: string;
  language: string;
  codeSnippetPath: string;
}

export interface CodeExampleBoxComponentOptions {
  expanderTitle: string;
  expanderDescription: string;
  codeSnippets: CodeSnippet[];
}

@Component({
  selector: 'app-code-example-box',
  standalone: true,
  imports: [MatExpansionModule, MatGridListModule, MatTabsModule, CodeSnippetBoxComponent],
  template: `
    <mat-expansion-panel [expanded]="true" class="outlined-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ options.expanderTitle }}</mat-panel-title>
        <mat-panel-description>{{ options.expanderDescription }}</mat-panel-description>
      </mat-expansion-panel-header>

      <div class="row">
        <div class="col col-render">
          <div class="col-header">Rendered</div>
          <ng-content></ng-content>
        </div>

        <div class="col col-code">
          <div class="col-header">Code</div>
          <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" [dynamicHeight]="false" animationDuration="0ms" [disableRipple]="true">
            @for (codeSnippet of options.codeSnippets; track codeSnippet.fileName) {
              <mat-tab [label]="codeSnippet.fileName">
                <app-code-snippet-box [codeSnippetPath]="codeSnippet.codeSnippetPath + '/' + codeSnippet.fileName" [language]="codeSnippet.language" />
              </mat-tab>
            }
          </mat-tab-group>
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: [
    `
      mat-expansion-panel {
        margin-bottom: 16px;
      }

      .outlined-panel {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        box-shadow: none;

        &.mat-expanded mat-expansion-panel-header {
          background-color: rgba(0, 0, 0, 0.06);
          margin-bottom: 16px;
        }
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: start;
      }

      .col {
        width: calc(50% - 8px);
        display: flex;
        flex-direction: column;

        &.col-render {
          justify-content: center;
        }
      }

      .col-header {
        font-size: 1.2em;
        margin-bottom: 8px;
        text-align: left;
        color: #fff;
        background: rgba(0, 0, 0, 0.38);
        padding: 8px;
      }
    `,
  ],
})
export class CodeExampleBoxComponent {
  @Input({ required: true }) options!: CodeExampleBoxComponentOptions;
}
