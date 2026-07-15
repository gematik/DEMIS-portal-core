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

import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-example-standalone',
  imports: [NgComponentOutlet, RouterLink, MatIconButton, MatIcon],
  template: `
    <div class="standalone-example-page" [class.full-viewport]="fullViewport()">
      @if (consumerPath(); as path) {
        <aside>
          <a class="floating-back-button" mat-icon-button [routerLink]="path" aria-label="Back to consumer" title="Back to consumer">
            <mat-icon>arrow_back</mat-icon>
          </a>
        </aside>
      }
      <div class="example-stage" [class.full-viewport]="fullViewport()">
        <ng-container *ngComponentOutlet="exampleComponent()" />
      </div>
    </div>
  `,
  styles: [
    `
      .standalone-example-page {
        box-sizing: border-box;
      }

      .floating-back-button {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1500;
        background-color: var(--color-white, #ffffff);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      .standalone-example-page.full-viewport {
        min-height: 100vh;
        min-height: 100dvh;
        height: 100vh;
        height: 100dvh;
        display: flex;
        flex-direction: column;
      }

      .example-stage.full-viewport {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      :host ::ng-deep .example-stage.full-viewport > * {
        flex: 1 1 auto;
        min-height: 0;
        height: 100% !important;
        width: 100% !important;
        display: block;
      }
    `,
  ],
})
export class ExampleStandaloneComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  readonly exampleComponent = computed(() => this.routeData()['exampleComponent'] as Type<unknown>);
  readonly fullViewport = computed(() => Boolean(this.routeData()['fullViewport']));
  readonly consumerPath = computed(() => this.routeData()['consumerPath'] as string | undefined);
}
