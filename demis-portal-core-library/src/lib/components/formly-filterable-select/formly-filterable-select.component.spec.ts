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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MockBuilder, MockRender } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { FormlyFilterableSelectComponent } from './formly-filterable-select.component';
import { FormlyFilterableSelectMockComponent, MOCK_OPTIONS, SINGLE_OPTION } from '../../../test/utils/formly-filterable-select.mock.component';
import { compareOptions, filterableSelectField, filterOptions, formatOptionDisplay, getOptionDescription, SelectOption } from './filterable-select-shared';

describe('FormlyFilterableSelectComponent', () => {
  let fixture: ComponentFixture<FormlyFilterableSelectMockComponent>;
  let loader: HarnessLoader;
  let mockComponent: FormlyFilterableSelectMockComponent;

  beforeEach(() => {
    return MockBuilder(FormlyFilterableSelectMockComponent)
      .keep(FormlyFilterableSelectComponent)
      .keep(ReactiveFormsModule)
      .keep(NoopAnimationsModule)
      .keep(MatFormFieldModule)
      .keep(MatSelectModule)
      .keep(FormlyMaterialModule)
      .keep(
        FormlyModule.forRoot({
          types: [{ name: 'filterable-select', component: FormlyFilterableSelectComponent, wrappers: ['form-field'] }],
        })
      );
  });

  beforeEach(() => {
    fixture = MockRender(FormlyFilterableSelectMockComponent);
    mockComponent = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  describe('Rendering', () => {
    it('should create the component', () => {
      const component = fixture.debugElement.query(By.directive(FormlyFilterableSelectComponent));
      expect(component).toBeTruthy();
    });

    it('should render a mat-select for the single-select field', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      expect(selects.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Single select', () => {
    it('should auto-select the only available option', () => {
      expect(mockComponent.form.get('singleOptionSelect')?.value).toEqual(SINGLE_OPTION as any);
    });

    it('should not auto-select the only available option for non-required select', () => {
      expect(mockComponent.form.get('singleOptionSelectNotRequired')?.value).toEqual(undefined);
    });

    it('should not overwrite an existing value when applying the single-option default', () => {
      expect(mockComponent.form.get('prefilledSingleOptionSelect')?.value).toEqual(MOCK_OPTIONS[0] as any);
    });

    it('should not apply single-option default when required with existing value', () => {
      expect(mockComponent.form.get('prefilledRequiredSingleOption')?.value).toEqual(SINGLE_OPTION as any);
    });

    it('should use defaultValue as existing value', () => {
      expect(mockComponent.form.get('nonRequiredSelectWithDefault')?.value).toEqual(MOCK_OPTIONS[0] as any);
    });

    it('should apply field-level defaultValue', () => {
      expect(mockComponent.form.get('fieldLevelDefaultSelect')?.value).toEqual(MOCK_OPTIONS[1] as any);
    });

    it('should not apply single-option default when value already exists', () => {
      const singleOptionSelect = mockComponent.form.get('singleOptionSelect')!;
      expect(singleOptionSelect.value).toEqual(SINGLE_OPTION as any);
      singleOptionSelect.setValue(MOCK_OPTIONS[0]);
      fixture.detectChanges();
      expect(singleOptionSelect.value).toEqual(MOCK_OPTIONS[0] as any);
    });

    it('should allow selecting an option', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const select = selects[0];

      await select.open();
      const options = await select.getOptions();
      // +1 for the ngx-mat-select-search wrapper option
      expect(options.length).toBe(MOCK_OPTIONS.length + 1);

      // Skip index 0 (search option), data options start at index 1
      await options[2].click();
      expect(mockComponent.form.get('singleSelect')?.value).toEqual(MOCK_OPTIONS[1] as any);
    });

    it('should display the selected value in the trigger', async () => {
      mockComponent.form.get('singleSelect')!.setValue(MOCK_OPTIONS[0]);
      fixture.detectChanges();

      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const valueText = await selects[0].getValueText();
      expect(valueText).toContain('Option Alpha');
    });
  });

  describe('Multi select', () => {
    it('should auto-select the only available option as an array in multi-select mode', () => {
      expect(mockComponent.form.get('singleOptionMultiSelect')?.value).toEqual([SINGLE_OPTION] as any);
    });

    it('should not auto-select the only available option as an array in  non-required multi-select mode', () => {
      expect(mockComponent.form.get('singleOptionMultiSelectNotRequired')?.value).toEqual(undefined);
    });

    it('should not overwrite existing multi-select values when applying the single-option default', () => {
      expect(mockComponent.form.get('prefilledSingleOptionMultiSelect')?.value).toEqual([MOCK_OPTIONS[0]] as any);
    });

    it('should use defaultValue as actual values', () => {
      expect(mockComponent.form.get('nonRequiredMultiSelectWithDefault')?.value).toEqual([MOCK_OPTIONS[0], MOCK_OPTIONS[1]] as any);
    });

    it('should not apply single-option default when multi-select value already exists', () => {
      const singleOptionMultiSelect = mockComponent.form.get('singleOptionMultiSelect')!;
      expect(singleOptionMultiSelect.value).toEqual([SINGLE_OPTION] as any);
      singleOptionMultiSelect.setValue([MOCK_OPTIONS[0], MOCK_OPTIONS[1]]);
      fixture.detectChanges();
      expect(singleOptionMultiSelect.value).toEqual([MOCK_OPTIONS[0], MOCK_OPTIONS[1]] as any);
    });

    it('should allow selecting multiple options', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];

      await multiSelect.open();
      const options = await multiSelect.getOptions();
      // Skip index 0 (search option), data options start at index 1
      await options[1].click();
      await options[3].click();
      await multiSelect.close();

      const value = mockComponent.form.get('multiSelect')?.value;
      expect(value).toEqual([MOCK_OPTIONS[0], MOCK_OPTIONS[2]] as any);
    });

    it('should render chips for multi-select values', () => {
      mockComponent.form.get('multiSelect')!.setValue([MOCK_OPTIONS[0], MOCK_OPTIONS[1]]);
      fixture.detectChanges();

      const filterableSelects = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent));
      const multiSelectHost = filterableSelects[1];
      const chips = multiSelectHost.queryAll(By.css('mat-chip'));
      expect(chips.length).toBe(2);
    });

    it('should remove a chip when the remove button is clicked', () => {
      mockComponent.form.get('multiSelect')!.setValue([MOCK_OPTIONS[0], MOCK_OPTIONS[1]]);
      fixture.detectChanges();

      const filterableSelects = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent));
      const multiSelectHost = filterableSelects[1];
      const removeButtons = multiSelectHost.queryAll(By.css('mat-chip button'));
      expect(removeButtons.length).toBe(2);

      removeButtons[0].nativeElement.click();
      fixture.detectChanges();

      const value = mockComponent.form.get('multiSelect')?.value;
      expect(value).toEqual([MOCK_OPTIONS[1]] as any);
    });
  });

  describe('clearSelection', () => {
    it('should clear single select value', () => {
      mockComponent.form.get('singleSelect')!.setValue(MOCK_OPTIONS[0]);
      fixture.detectChanges();

      const clearButton = fixture.debugElement.queryAll(By.css('.clear-button'))[0];
      expect(clearButton).toBeTruthy();
      clearButton.nativeElement.click();
      fixture.detectChanges();

      expect(mockComponent.form.get('singleSelect')?.value).toBeNull();
    });

    it('should clear multi select value', () => {
      mockComponent.form.get('multiSelect')!.setValue([MOCK_OPTIONS[0], MOCK_OPTIONS[1]]);
      fixture.detectChanges();

      const filterableSelects = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent));
      const multiSelectHost = filterableSelects[1];
      const clearButton = multiSelectHost.query(By.css('.clear-button'));
      expect(clearButton).toBeTruthy();
      clearButton.nativeElement.click();
      fixture.detectChanges();

      expect(mockComponent.form.get('multiSelect')?.value).toEqual([] as any);
    });
  });

  describe('openSelect', () => {
    it('should open the select panel when chip area is clicked', async () => {
      mockComponent.form.get('multiSelect')!.setValue([MOCK_OPTIONS[0]]);
      fixture.detectChanges();

      const chipArea = fixture.debugElement.queryAll(By.css('.filterable-select-chip-area'))[0];
      expect(chipArea).toBeTruthy();
      chipArea.nativeElement.click();
      fixture.detectChanges();

      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      expect(await multiSelect.isOpen()).toBe(true);
    });

    it('should open the panel when called programmatically', async () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[0].componentInstance as FormlyFilterableSelectComponent;
      expect(component.matSelectRef().panelOpen).toBe(false);

      component.openSelect();
      fixture.detectChanges();

      expect(component.matSelectRef().panelOpen).toBe(true);
    });

    it('should not re-open the panel if it is already open', async () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[0].componentInstance as FormlyFilterableSelectComponent;

      component.openSelect();
      fixture.detectChanges();
      expect(component.matSelectRef().panelOpen).toBe(true);

      const openSpy = vi.spyOn(component.matSelectRef(), 'open');
      component.openSelect();
      fixture.detectChanges();

      expect(openSpy).not.toHaveBeenCalled();
    });
  });

  describe('repositionOverlay', () => {
    it('should reposition the overlay when value changes while panel is open', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const overlayRef = (matSelect as any)._overlayDir?.overlayRef;
      if (overlayRef) {
        vi.spyOn(overlayRef, 'updatePosition');
      }

      // Trigger valueChanges while panel is open
      component.formControl.setValue([MOCK_OPTIONS[0]]);
      fixture.detectChanges();

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      if (overlayRef) {
        expect(overlayRef.updatePosition).toHaveBeenCalled();
      }
    });
  });

  describe('onPanelClose', () => {
    it('should reset search control when panel closes', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[0].componentInstance as FormlyFilterableSelectComponent;
      component.searchControl.setValue('test');
      expect(component.searchControl.value).toBe('test');

      component.onPanelClose();

      expect(component.searchControl.value).toBe('');
    });
  });

  describe('custom props', () => {
    it('should display the trigger text with value when showValue is true', async () => {
      mockComponent.form.get('selectWithCode')!.setValue(MOCK_OPTIONS[0]);
      fixture.detectChanges();

      const selects = await loader.getAllHarnesses(MatSelectHarness);
      // selectWithCode is the third select
      const valueText = await selects[3].getValueText();
      expect(valueText).toContain('Option Alpha | OPT1');
    });
  });

  describe('edge case branches', () => {
    it('should return empty trigger display when multiple is true and value is empty array', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      expect(component.multiple()).toBe(true);
      component.formControl.setValue([]);
      fixture.detectChanges();
      expect(component.triggerDisplay()).toBe('');
    });

    it('should return "x ausgewählt" trigger display when multiple is true and values are selected', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      expect(component.multiple()).toBe(true);
      component.formControl.setValue([MOCK_OPTIONS[0], MOCK_OPTIONS[1]]);
      fixture.detectChanges();
      expect(component.triggerDisplay()).toBe('2 ausgewählt');
    });

    it('should handle null search control value', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[0].componentInstance as FormlyFilterableSelectComponent;
      component.searchControl.setValue(null);
      fixture.detectChanges();
      expect(component.filteredOptions().length).toBe(MOCK_OPTIONS.length);
    });

    it('should handle removeChip when formControl value is null', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      component.formControl.setValue(null);
      fixture.detectChanges();
      component.removeChip(MOCK_OPTIONS[0]);
      expect(mockComponent.form.get('multiSelect')?.value).toEqual([] as any);
    });
  });

  describe('onSearchKeydown', () => {
    it('should toggle the active option on Enter in multi-select', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const realOptions = matSelect.options.filter(o => !o.disabled);

      // Simulate key manager highlighting the first real option
      (matSelect as any)._keyManager.setActiveItem(realOptions[0]);
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      component.onSearchKeydown(enterEvent);
      fixture.detectChanges();

      expect(enterEvent.defaultPrevented).toBe(true);
      const value = mockComponent.form.get('multiSelect')?.value;
      expect(value).toEqual([MOCK_OPTIONS[0]] as any);
    });

    it('should do nothing on Enter when no active option exists', () => {
      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;

      // Call without opening the panel — no active option exists
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      component.onSearchKeydown(enterEvent);
      fixture.detectChanges();

      const value = mockComponent.form.get('multiSelect')?.value;
      expect(value).toBeUndefined();
    });

    it('should not intercept non-Enter and non-Arrow keys', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      component.onSearchKeydown(spaceEvent);

      expect(spaceEvent.defaultPrevented).toBe(false);
    });

    it('should navigate exactly one step on ArrowDown', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const keyManager = (matSelect as any)._keyManager;
      const realOptions = matSelect.options.filter(o => !o.disabled);

      keyManager.setActiveItem(realOptions[0]);
      fixture.detectChanges();
      expect(keyManager.activeItem).toBe(realOptions[0]);

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true } as KeyboardEventInit);
      component.onSearchKeydown(arrowDownEvent);
      fixture.detectChanges();

      expect(keyManager.activeItem).toBe(realOptions[1]);
    });

    it('should navigate exactly one step on ArrowUp', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const keyManager = (matSelect as any)._keyManager;
      const realOptions = matSelect.options.filter(o => !o.disabled);

      keyManager.setActiveItem(realOptions[2]);
      fixture.detectChanges();
      expect(keyManager.activeItem).toBe(realOptions[2]);

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38, bubbles: true, cancelable: true } as KeyboardEventInit);
      component.onSearchKeydown(arrowUpEvent);
      fixture.detectChanges();

      expect(keyManager.activeItem).toBe(realOptions[1]);
    });

    it('should stop propagation of arrow key events', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true } as KeyboardEventInit);
      const stopSpy = vi.spyOn(arrowDownEvent, 'stopPropagation');
      component.onSearchKeydown(arrowDownEvent);

      expect(stopSpy).toHaveBeenCalled();
    });

    it('should skip the disabled search-wrapper option on ArrowUp', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const keyManager = (matSelect as any)._keyManager;
      const realOptions = matSelect.options.filter(o => !o.disabled);

      // Start at the first real option and press ArrowUp
      keyManager.setActiveItem(realOptions[0]);
      fixture.detectChanges();

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38, bubbles: true, cancelable: true } as KeyboardEventInit);
      component.onSearchKeydown(arrowUpEvent);
      fixture.detectChanges();

      // Should NOT land on the disabled search-wrapper option
      expect(keyManager.activeItem?.disabled).toBeFalsy();
    });

    it('should select the option when Shift+ArrowDown is pressed in multi-select', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const multiSelect = selects[1];
      await multiSelect.open();

      const component = fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
      const matSelect = component.matSelectRef();
      const keyManager = (matSelect as any)._keyManager;
      const realOptions = matSelect.options.filter(o => !o.disabled);

      keyManager.setActiveItem(realOptions[0]);
      fixture.detectChanges();

      const shiftArrowDown = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        keyCode: 40,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      } as KeyboardEventInit);
      component.onSearchKeydown(shiftArrowDown);
      fixture.detectChanges();

      // The newly active item should have been selected via interaction
      const value = mockComponent.form.get('multiSelect')?.value;
      expect(value?.length).toBeGreaterThan(0);
    });
  });

  describe('ensureActiveOptionBelowStickySearch', () => {
    function getComponent(): FormlyFilterableSelectComponent {
      return fixture.debugElement.queryAll(By.directive(FormlyFilterableSelectComponent))[1].componentInstance as FormlyFilterableSelectComponent;
    }

    function callHelper(component: FormlyFilterableSelectComponent): void {
      (component as any).ensureActiveOptionBelowStickySearch();
    }

    function stubSelect(component: FormlyFilterableSelectComponent, fake: unknown): void {
      Object.defineProperty(component, 'matSelectRef', { value: () => fake, configurable: true });
    }

    it('should return early when the panel is closed', () => {
      const component = getComponent();
      // Panel was never opened -> panelOpen is false
      expect(() => callHelper(component)).not.toThrow();
    });

    it('should fall back to an empty options array when select.options is undefined', () => {
      const component = getComponent();
      stubSelect(component, { panelOpen: true, options: undefined });
      expect(() => callHelper(component)).not.toThrow();
    });

    it('should return early when no option is active', () => {
      const component = getComponent();
      stubSelect(component, {
        panelOpen: true,
        options: { toArray: () => [{ active: false }, { active: false }] },
      });
      expect(() => callHelper(component)).not.toThrow();
    });

    it('should return early when the panel element cannot be located', () => {
      const component = getComponent();
      stubSelect(component, {
        panelOpen: true,
        options: { toArray: () => [{ active: false }, { active: true }] },
      });
      vi.spyOn(document, 'querySelector').mockReturnValue(null);
      expect(() => callHelper(component)).not.toThrow();
    });

    it('should return early when the option element index has no DOM counterpart', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      await selects[1].open();

      const component = getComponent();
      // Real panel exists, but report a far out-of-range active index
      stubSelect(component, {
        panelOpen: true,
        options: { toArray: () => Array.from({ length: 999 }, (_, i) => ({ active: i === 998 })) },
      });
      expect(() => callHelper(component)).not.toThrow();
    });

    it('should fall back to a default sticky height when offsetHeight is falsy', () => {
      const component = getComponent();
      // Build a synthetic panel with two options directly in the DOM
      const panel = document.createElement('div');
      panel.classList.add('mat-mdc-select-panel');
      const stickyOption = document.createElement('div');
      stickyOption.classList.add('mat-mdc-option');
      const dataOption = document.createElement('div');
      dataOption.classList.add('mat-mdc-option');
      panel.appendChild(stickyOption);
      panel.appendChild(dataOption);
      document.body.appendChild(panel);
      // Force offsetHeight to 0 so the `?? 48` fallback branch fires
      vi.spyOn(stickyOption, 'offsetHeight', 'get').mockReturnValue(0);

      stubSelect(component, {
        panelOpen: true,
        options: { toArray: () => [{ active: false }, { active: true }] },
      });
      try {
        expect(() => callHelper(component)).not.toThrow();
      } finally {
        document.body.removeChild(panel);
      }
    });

    it('should adjust scrollTop when the active option sits behind the sticky search', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      await selects[1].open();

      const component = getComponent();
      const realPanel = document.querySelector('.mat-mdc-select-panel') as HTMLElement;
      const realOptions = realPanel.querySelectorAll<HTMLElement>('.mat-mdc-option');
      // Pretend the panel is scrolled past the top so the second option visually overlaps the sticky search
      realPanel.scrollTop = 1000;

      stubSelect(component, {
        panelOpen: true,
        options: { toArray: () => Array.from({ length: realOptions.length }, (_, i) => ({ active: i === 1 })) },
      });
      callHelper(component);

      expect(realPanel.scrollTop).toBeLessThan(1000);
    });
  });
});

describe('filterable-select-shared utilities', () => {
  const options: SelectOption[] = [
    { value: 'A', label: 'Apple' },
    { value: 'B', label: 'Banana' },
    { value: 'C', label: 'Cherry' },
  ];

  describe('compareOptions', () => {
    it('should return true for same value', () => {
      expect(compareOptions({ value: 'A', label: 'X' }, { value: 'A', label: 'Y' }, 'value')).toBe(true);
    });

    it('should return false for different values', () => {
      expect(compareOptions({ value: 'A', label: 'X' }, { value: 'B', label: 'X' }, 'value')).toBe(false);
    });

    it('should handle null/undefined gracefully', () => {
      expect(compareOptions(null as any, { value: 'A', label: 'X' }, 'value')).toBe(false);
    });

    it('should work with custom valueKey', () => {
      expect(compareOptions({ code: 'X' }, { code: 'X' }, 'code')).toBe(true);
      expect(compareOptions({ code: 'X' }, { code: 'Y' }, 'code')).toBe(false);
    });
  });

  describe('filterOptions', () => {
    it('should return all options when search term is empty', () => {
      expect(filterOptions(options, '', false, 'label', 'value')).toEqual(options);
    });

    it('should filter by label', () => {
      const result = filterOptions(options, 'ban', false, 'label', 'value');
      expect(result.length).toBe(1);
      expect(result[0].value).toBe('B');
    });

    it('should filter by value when showValue is true', () => {
      const result = filterOptions(options, 'C', true, 'label', 'value');
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Cherry');
    });

    it('should not filter by value when showValue is false', () => {
      const result = filterOptions(options, 'B', false, 'label', 'value');
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Banana');
    });

    it('should return empty array when nothing matches', () => {
      expect(filterOptions(options, 'xyz', false, 'label', 'value')).toEqual([]);
    });

    it('should work with custom keys', () => {
      const customOptions = [
        { code: 'A', display: 'Alpha' },
        { code: 'B', display: 'Beta' },
      ];
      const result = filterOptions(customOptions, 'bet', false, 'display', 'code');
      expect(result.length).toBe(1);
      expect(result[0].code).toBe('B');
    });
  });

  describe('formatOptionDisplay', () => {
    it('should return label only when showValue is false', () => {
      expect(formatOptionDisplay({ value: 'A', label: 'Apple' }, false, 'label', 'value')).toBe('Apple');
    });

    it('should return label with value when showValue is true', () => {
      expect(formatOptionDisplay({ value: 'A', label: 'Apple' }, true, 'label', 'value')).toBe('Apple | A');
    });

    it('should return empty string for undefined', () => {
      expect(formatOptionDisplay(undefined, false, 'label', 'value')).toBe('');
    });

    it('should work with custom keys', () => {
      expect(formatOptionDisplay({ code: 'X', display: 'Custom' }, false, 'display', 'code')).toBe('Custom');
      expect(formatOptionDisplay({ code: 'X', display: 'Custom' }, true, 'display', 'code')).toBe('Custom | X');
    });

    it('should return fallback empty strings when keys are missing on option', () => {
      expect(formatOptionDisplay({}, false, 'label', 'value')).toBe('');
      expect(formatOptionDisplay({}, true, 'label', 'value')).toBe(' | ');
    });
  });

  describe('getOptionDescription', () => {
    it('should return the description for the given key', () => {
      expect(getOptionDescription({ description: 'A desc' }, 'description')).toBe('A desc');
    });

    it('should return undefined when key is missing', () => {
      expect(getOptionDescription({ other: 'X' }, 'description')).toBeUndefined();
    });

    it('should return undefined for null option', () => {
      expect(getOptionDescription(null, 'description')).toBeUndefined();
    });
  });

  describe('filterableSelectField', () => {
    it('should create a minimal field config with SelectOption defaults', () => {
      const options: SelectOption[] = [
        { value: 'A', label: 'Alpha' },
        { value: 'B', label: 'Beta' },
      ];
      const result = filterableSelectField({ key: 'test', label: 'Test', options });

      expect(result.key).toBe('test');
      expect(result.type).toBe('filterable-select');
      expect(result.props!['label']).toBe('Test');
      expect(result.props!['options']).toEqual(options);
      expect(result.id).toBeUndefined();
    });

    it('should include id when provided', () => {
      const result = filterableSelectField<SelectOption>({ id: 'my-id', key: 'test', label: 'Test', options: [] });
      expect(result.id).toBe('my-id');
    });

    it('should pass all optional props when provided', () => {
      const result = filterableSelectField<SelectOption>({
        key: 'test',
        label: 'Test',
        options: [],
        required: true,
        multiple: true,
        showValue: true,
        clearable: false,
        searchPlaceholder: 'Find...',
        noEntriesFoundLabel: 'None',
      });

      expect(result.props!['required']).toBe(true);
      expect(result.props!['multiple']).toBe(true);
      expect(result.props!['showValue']).toBe(true);
      expect(result.props!['clearable']).toBe(false);
      expect(result.props!['searchPlaceholder']).toBe('Find...');
      expect(result.props!['noEntriesFoundLabel']).toBe('None');
    });

    it('should not include optional props when not provided', () => {
      const result = filterableSelectField<SelectOption>({ key: 'test', label: 'Test', options: [] });

      expect(result.props!['required']).toBeUndefined();
      expect(result.props!['multiple']).toBeUndefined();
      expect(result.props!['showValue']).toBeUndefined();
      expect(result.props!['clearable']).toBeUndefined();
      expect(result.props!['searchPlaceholder']).toBeUndefined();
      expect(result.props!['noEntriesFoundLabel']).toBeUndefined();
    });

    it('should infer defaultValue when exactly one option exists in single-select mode', () => {
      const options: SelectOption[] = [{ value: 'ONLY', label: 'Only option' }];
      const result = filterableSelectField<SelectOption>({ key: 'test', label: 'Test', options });

      expect(result.defaultValue).toEqual(options[0]);
    });

    it('should infer defaultValue as array when exactly one option exists in multi-select mode', () => {
      const options: SelectOption[] = [{ value: 'ONLY', label: 'Only option' }];
      const result = filterableSelectField<SelectOption>({ key: 'test', label: 'Test', options, multiple: true });

      expect(result.defaultValue).toEqual([options[0]]);
    });

    it('should use explicit defaultValue when it matches one of the provided options', () => {
      const options: SelectOption[] = [
        { value: 'first', label: 'first option' },
        { value: 'second', label: 'second option' },
      ];
      const explicitDefault: SelectOption = { value: 'first', label: 'first option' };
      const result = filterableSelectField<SelectOption>({ key: 'test', label: 'Test', options, defaultValue: explicitDefault });

      expect(result.defaultValue).toEqual(explicitDefault);
    });

    it('should accept an explicit multi-select defaultValue when all values match provided options', () => {
      const options: SelectOption[] = [
        { value: 'first', label: 'first option' },
        { value: 'second', label: 'second option' },
      ];
      const explicitDefaults: SelectOption[] = [
        { value: 'first', label: 'first option' },
        { value: 'second', label: 'second option' },
      ];
      const result = filterableSelectField<SelectOption>({
        key: 'test',
        label: 'Test',
        options,
        multiple: true,
        defaultValue: explicitDefaults,
      });

      expect(result.defaultValue).toEqual(explicitDefaults);
    });

    it('should work with custom domain objects using explicit keys', () => {
      interface CustomObj {
        code: string;
        display: string;
        info: string;
      }
      const customOptions: CustomObj[] = [{ code: 'X', display: 'Ex', info: 'Extra' }];
      const result = filterableSelectField({
        key: 'custom',
        label: 'Custom',
        options: customOptions,
        optionValueKey: 'code',
        optionLabelKey: 'display',
        optionDescriptionKey: 'info',
      });

      expect(result.props!['options']).toEqual(customOptions);
      expect(result.props!['optionValueKey']).toBe('code');
      expect(result.props!['optionLabelKey']).toBe('display');
      expect(result.props!['optionDescriptionKey']).toBe('info');
    });
  });
});
