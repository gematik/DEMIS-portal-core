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

import { Component, computed, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Subject, takeUntil } from 'rxjs';
import { compareOptions, filterOptions, formatOptionDisplay, getOptionDescription, FilterableSelectCustomProps } from './filterable-select-shared';
import { FilterableSelectStylesComponent } from './filterable-select-styles.component';

@Component({
  selector: 'gem-demis-filterable-select',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    FormlyModule,
    NgxMatSelectSearchModule,
    FilterableSelectStylesComponent,
  ],
  templateUrl: './formly-filterable-select.component.html',
  styleUrl: './formly-filterable-select.component.scss',
})
export class FormlyFilterableSelectComponent extends FieldType<FieldTypeConfig> implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private readonly destroy$ = new Subject<void>();
  private readonly searchTerm = signal('');
  private readonly allOptions = signal<any[]>([]);
  readonly currentValue = signal<any>(null);
  readonly matSelectRef = viewChild.required(MatSelect);

  readonly multiple = signal(false);
  readonly showValue = signal(false);
  readonly clearable = signal(true);
  readonly searchPlaceholder = signal('Suchen...');
  readonly noEntriesFoundLabel = signal('Keine Einträge gefunden');
  readonly optionValueKey = signal('value');
  readonly optionLabelKey = signal('label');
  readonly optionDescriptionKey = signal('description');

  readonly filteredOptions = computed(() =>
    filterOptions(this.allOptions(), this.searchTerm(), this.showValue(), this.optionLabelKey(), this.optionValueKey())
  );
  readonly selectedValues = computed<any[]>(() => {
    const val = this.currentValue();
    return Array.isArray(val) ? val : [];
  });
  readonly hasValue = computed(() => {
    const val = this.currentValue();
    if (this.multiple()) {
      return Array.isArray(val) && val.length > 0;
    }
    return val != null;
  });
  readonly triggerDisplay = computed(() => {
    if (this.multiple()) {
      const val = this.selectedValues();
      return val.length > 0 ? `${val.length} ausgewählt` : '';
    }
    return formatOptionDisplay(this.currentValue(), this.showValue(), this.optionLabelKey(), this.optionValueKey());
  });

  compareFn = (a: any, b: any) => compareOptions(a, b, this.optionValueKey());
  displayFn = (option: any) => formatOptionDisplay(option, this.showValue(), this.optionLabelKey(), this.optionValueKey());
  descriptionFn = (option: any) => getOptionDescription(option, this.optionDescriptionKey());

  ngOnInit(): void {
    const props = this.props as FilterableSelectCustomProps;
    this.multiple.set(props.multiple ?? false);
    this.showValue.set(props.showValue ?? false);
    this.clearable.set(props.clearable ?? true);
    this.searchPlaceholder.set(props.searchPlaceholder ?? 'Suchen...');
    this.noEntriesFoundLabel.set(props.noEntriesFoundLabel ?? 'Keine Einträge gefunden');
    this.optionValueKey.set(props.optionValueKey ?? 'value');
    this.optionLabelKey.set(props.optionLabelKey ?? 'label');
    this.optionDescriptionKey.set(props.optionDescriptionKey ?? 'description');
    this.allOptions.set(props.options ?? []);

    this.currentValue.set(this.formControl.value);
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.currentValue.set(value);
      this.repositionOverlay();
    });

    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.searchTerm.set(value ?? '');
    });
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeChip(option: any): void {
    const current: any[] = this.formControl.value ?? [];
    const vk = this.optionValueKey();
    this.formControl.setValue(current.filter(o => o[vk] !== option[vk]));
    this.formControl.markAsTouched();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.formControl.setValue(this.multiple() ? [] : null);
    this.formControl.markAsTouched();
    this.matSelectRef().focus();
  }

  onPanelClose(): void {
    this.searchControl.setValue('');
  }

  private repositionOverlay(): void {
    const select = this.matSelectRef();
    if (select.panelOpen) {
      // Allow DOM to update (chip added/removed) before recalculating position
      requestAnimationFrame(() => {
        (select as any)._overlayDir?.overlayRef?.updatePosition();
      });
    }
  }

  openSelect(): void {
    if (!this.matSelectRef().panelOpen) {
      this.matSelectRef().open();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      const activeOption = this.matSelectRef().options?.find(option => option.active && !option.disabled);
      if (activeOption) {
        activeOption._selectViaInteraction();
      }
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.stopPropagation();
      const keyManager = (this.matSelectRef() as any)._keyManager;
      if (keyManager) {
        const previouslyActiveItem = keyManager.activeItem;
        keyManager.onKeydown(event);
        // Index 0 is the search-wrapper mat-option — always skip it
        if (keyManager.activeItemIndex === 0) {
          keyManager.setActiveItem(1);
        }
        if (this.multiple() && event.shiftKey && keyManager.activeItem && keyManager.activeItem !== previouslyActiveItem) {
          keyManager.activeItem._selectViaInteraction();
        }
      }
    }
  }
}
