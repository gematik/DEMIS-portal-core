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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, signal, input } from '@angular/core';
import { MaxContainerHeightService } from '../../services/max-container-height.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

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
  imports: [CommonModule],
})
export class MaxHeightContentContainerComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  readonly elementSelectorsToSubtract = input.required<string[]>();
  protected containerHeight = signal('100vh');

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly maxContainerHeightService = inject(MaxContainerHeightService);
  private resizeObservers: ResizeObserver[] = [];
  private elementsToSubtract: Element[] = [];
  private readonly resizeTrigger = new Subject<void>();
  private readonly unsubscriber = new Subject<void>();

  ngOnInit(): void {
    this.resizeTrigger
      .asObservable()
      .pipe(debounceTime(5), takeUntil(this.unsubscriber.asObservable()))
      .subscribe(() => this.refreshMaxClientHeight(this.elementsToSubtract));
  }

  ngAfterViewChecked(): void {
    this.registerObservers();
    this.refreshMaxClientHeight(this.elementsToSubtract);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.registerObservers();
    this.refreshMaxClientHeight(this.elementsToSubtract);
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private registerObservers(): void {
    for (const resizeObserver of this.resizeObservers) {
      resizeObserver.disconnect();
    }
    this.elementsToSubtract = [];
    for (const selector of this.elementSelectorsToSubtract()) {
      const elements = document.querySelectorAll(selector);
      this.elementsToSubtract = this.elementsToSubtract.concat(Array.from(elements));
    }
    this.resizeObservers = this.elementsToSubtract.map(elementToSubtract => {
      const resizeObserver = new ResizeObserver(() => {
        this.resizeTrigger.next();
      });
      resizeObserver.observe(elementToSubtract, { box: 'border-box' });
      return resizeObserver;
    });
  }

  private refreshMaxClientHeight(elementsToSubtract: Element[]): void {
    const maxContainerHeight = this.maxContainerHeightService.calculateMaxContainerHeight(elementsToSubtract);
    this.containerHeight.set(maxContainerHeight);
    this.changeDetectorRef.detectChanges();
  }
}
