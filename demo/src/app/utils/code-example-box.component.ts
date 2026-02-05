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

import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
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
  imports: [MatExpansionModule, MatGridListModule, MatTabsModule, MatButton, MatIcon, CodeSnippetBoxComponent, NgClass],
  template: `
    <mat-expansion-panel [expanded]="true" class="outlined-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ options().expanderTitle }}</mat-panel-title>
        <mat-panel-description>{{ options().expanderDescription }}</mat-panel-description>
      </mat-expansion-panel-header>

      <div class="row">
        <div class="col col-render" [ngClass]="{ shrunk: isRenderedSectionCollapsed() }">
          <div class="col-header toggle-header">
            <button
              mat-stroked-button
              (click)="isRenderedSectionCollapsed.set(!isRenderedSectionCollapsed())"
              [title]="isRenderedSectionCollapsed() ? 'Expand rendered section' : 'Shrink rendered section'">
              <mat-icon>{{ isRenderedSectionCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
            </button>
            <span>Rendered</span>
          </div>
          @if (!isRenderedSectionCollapsed()) {
            <ng-content></ng-content>
          }
        </div>

        <div class="col col-code" [ngClass]="{ shrunk: isCodeSectionCollapsed() }">
          <div class="col-header toggle-header">
            <button
              mat-stroked-button
              (click)="isCodeSectionCollapsed.set(!isCodeSectionCollapsed())"
              [title]="isCodeSectionCollapsed() ? 'Expand code section' : 'Shrink code section'">
              <mat-icon>{{ isCodeSectionCollapsed() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
            </button>
            <span>Code</span>
          </div>
          @if (!isCodeSectionCollapsed()) {
            <mat-tab-group
              [ngClass]="{ enlarged: isRenderedSectionCollapsed() }"
              mat-stretch-tabs="false"
              mat-align-tabs="start"
              [dynamicHeight]="false"
              animationDuration="0ms"
              [disableRipple]="true">
              @for (codeSnippet of options().codeSnippets; track codeSnippet.fileName) {
                <mat-tab [label]="codeSnippet.fileName">
                  <app-code-snippet-box [codeSnippetPath]="codeSnippet.codeSnippetPath + '/' + codeSnippet.fileName" [language]="codeSnippet.language" />
                </mat-tab>
              }
            </mat-tab-group>
          }
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
        width: calc(100% - 8px);
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

      .toggle-header {
        button {
          min-width: 42px;

          .mat-icon {
            margin: 0;
          }
        }

        span {
          margin-left: 8px;
        }
      }

      .shrunk {
        width: 170px !important;
      }

      .mat-mdc-tab-group {
        max-width: 41vw !important;
      }

      .mat-mdc-tab-group.enlarged {
        max-width: 75vw !important;
      }
    `,
  ],
})
export class CodeExampleBoxComponent {
  readonly options = input.required<CodeExampleBoxComponentOptions>();
  readonly isRenderedSectionCollapsed = signal(false);
  readonly isCodeSectionCollapsed = signal(false);
}
