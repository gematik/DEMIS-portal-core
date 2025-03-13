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



import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { MaxContainerHeightService } from '../../services/max-container-height.service';

@Component({
  selector: 'gem-demis-max-height-content-container',
  template: `
    <div id="gem-demis-max-height-content-container" [style.height]="containerHeight()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      #gem-demis-max-height-content-container {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class MaxHeightContentContainerComponent implements AfterViewInit, OnChanges {
  @Input() navbarTag = 'app-navbar';
  protected containerHeight = signal('100vh');

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly maxContainerHeightService = inject(MaxContainerHeightService);

  ngAfterViewInit(): void {
    this.refreshMaxClientHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshMaxClientHeight();
  }

  private refreshMaxClientHeight(): void {
    const navBar = Array.from(document.getElementsByTagName(this.navbarTag));
    const maxContainerHeight = this.maxContainerHeightService.calculateMaxContainerHeight(navBar);
    this.containerHeight.set(maxContainerHeight);
    this.changeDetectorRef.detectChanges();
  }
}
