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

import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaxContainerHeightService } from '../../services/max-container-height.service';

@Component({
  selector: 'gem-demis-tiled-content',
  templateUrl: './tiled-content.component.html',
  styleUrl: './tiled-content.component.scss',
  standalone: true,
  imports: [CommonModule, MatSidenavModule],
})
export class TiledContentComponent implements AfterViewInit, OnChanges {
  protected containerHeight = signal('100vh');
  private readonly maxContainerHeightService = inject(MaxContainerHeightService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.refreshMaxClientHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshMaxClientHeight();
  }

  private refreshMaxClientHeight(): void {
    const appNavbar = document.getElementsByTagName('app-navbar');
    const actionsBar = document.getElementsByTagName('gem-demis-actions-bar');
    const maxContainerHeight = this.maxContainerHeightService.calculateMaxContainerHeight([...Array.from(appNavbar), ...Array.from(actionsBar)]);
    this.containerHeight.set(maxContainerHeight);
    this.changeDetectorRef.detectChanges();
  }
}
