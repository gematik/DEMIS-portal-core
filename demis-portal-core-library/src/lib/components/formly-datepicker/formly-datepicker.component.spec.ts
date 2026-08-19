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

import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCalendarHarness, MatDatepickerInputHarness, MatDatepickerToggleHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { format, isValid, setDate } from 'date-fns';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FormlyDatepickerMockComponent } from '../../../test/utils/formly-datepicker.mock.component';
import { getButton, getDatepicker } from '../../../test/utils/test-utils';
import { DatePrecision } from './datepicker-shared';
import { FormlyDatepickerComponent } from './formly-datepicker.component';
import { DatepickerHeaderComponent } from './header/datepicker-header.component';

describe('FormlyDatepickerComponent', () => {
  let component: FormlyDatepickerComponent;
  let header: DatepickerHeaderComponent;
  let fixture: ComponentFixture<FormlyDatepickerMockComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    return MockBuilder(FormlyDatepickerMockComponent)
      .keep(FormlyDatepickerComponent)
      .keep(ReactiveFormsModule)
      .keep(NoopAnimationsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(FormlyMaterialModule)
      .keep(
        FormlyModule.forRoot({
          types: [{ name: 'datepicker', component: FormlyDatepickerComponent, wrappers: ['form-field'] }],
        })
      );
  });

  beforeEach(() => {
    fixture = MockRender(FormlyDatepickerMockComponent);
    const datepickerEl = fixture.debugElement.query(By.directive(FormlyDatepickerComponent));
    component = datepickerEl.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  describe('Initial rendering', () => {
    it('should create the component', () => {
      const datepicker = fixture.debugElement.query(By.directive(FormlyDatepickerComponent));
      expect(datepicker).toBeTruthy();
    });
  });

  describe('User enters date manually', () => {
    describe('datepicker can handle 3 input precision levels: day, month and year', () => {
      let inputField: MatDatepickerInputHarness;

      beforeEach(async () => {
        inputField = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
      });

      it('User can type date with day precision', async () => {
        await inputField.setValue('12.06.2022');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-06-12');
      });

      it('User can type date with month precision', async () => {
        await inputField.setValue('06.2022');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-06');
      });

      it('User can type date with year precision', async () => {
        await inputField.setValue('2022');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022');
      });
    });

    describe('it is possible to restrict the allowed input formats', () => {
      it('input field should only accept day precision and reject other formats', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('12.06.2022');
        expect(control?.valid).toBe(true);

        await inputField.setValue('06.2022');
        expect(control?.invalid).toBe(true);
        expect(control?.hasError('formatMismatch')).toBe(true);

        await inputField.setValue('2022');
        expect(control?.invalid).toBe(true);
        expect(control?.hasError('formatMismatch')).toBe(true);
      });
    });

    describe('Input validation sets correct FormControl errors', () => {
      it('min date violation sets matDatepickerMin error', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('01.01.1869');
        await inputField.blur();
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('matDatepickerMin')).toBe(true);
      });

      it('max date violation sets matDatepickerMax error', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('01.01.2500');
        await inputField.blur();
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('matDatepickerMax')).toBe(true);
      });

      it('required field sets required error when empty', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('');
        await inputField.blur();
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('required')).toBe(true);
      });

      it('invalid dates set invalidDate error', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('31.02.2022');
        await inputField.blur();
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('invalidDate')).toBe(true);
      });

      it('invalid formats set formatMismatch error', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const control = component.form.get('datepickerWithConstraints');

        await inputField.setValue('1547.554.32');
        await inputField.blur();
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('formatMismatch')).toBe(true);
      });
    });

    describe('Default precision behavior', () => {
      it('default precision is day, month, and year formats', async () => {
        const inputField = await getDatepicker(loader, '#defaultDatepicker-datepicker-input-field');
        const control = component.form.get('defaultDatepicker');

        await inputField.setValue('12.06.2022');
        expect(component.model['defaultDatepicker']).toEqual('2022-06-12');
        expect(control?.invalid).toBe(false);

        await inputField.setValue('06.2022');
        expect(control?.invalid).toBe(false);

        await inputField.setValue('2022');
        expect(control?.invalid).toBe(false);
      });
    });

    describe('User can enter a date without dots', () => {
      let inputField: MatDatepickerInputHarness;

      beforeEach(async () => {
        inputField = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
      });

      it('User can type date with day precision without dots', async () => {
        await inputField.setValue('12062022');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-06-12');
      });

      it('User can type date with month precision without dots', async () => {
        await inputField.setValue('062022');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-06');
      });
    });
  });

  describe('FormControl values are set programmatically with German date format', () => {
    describe('datepicker can handle 3 input precision levels when set programmatically', () => {
      let inputField: MatDatepickerInputHarness;

      beforeEach(async () => {
        inputField = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
      });

      it('FormControl can be set with German day precision format (dd.MM.yyyy)', async () => {
        component.form.get('datepickerAllPrecisionLevels')!.setValue('01.03.2022');
        fixture.detectChanges();
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-03-01');
        const displayedValue = await inputField.getValue();
        expect(displayedValue).toBe('01.03.2022');
      });

      it('FormControl can be set with German month precision format (MM.yyyy)', async () => {
        component.form.get('datepickerAllPrecisionLevels')!.setValue('05.2023');
        fixture.detectChanges();
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023-05');
        const displayedValue = await inputField.getValue();
        expect(displayedValue).toBe('05.2023');
      });

      it('FormControl can be set with year precision format (yyyy)', async () => {
        component.form.get('datepickerAllPrecisionLevels')!.setValue('2025');
        fixture.detectChanges();
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2025');
        const displayedValue = await inputField.getValue();
        expect(displayedValue).toBe('2025');
      });
    });

    describe('FormControl validation works as expected with German formats', () => {
      it('German day format validation with constraints', async () => {
        const control = component.form.get('datepickerWithConstraints');
        control!.setValue('15.06.1950');
        fixture.detectChanges();

        expect(control?.valid).toBe(true);
        expect(component.model['datepickerWithConstraints']).toEqual('1950-06-15');

        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        const displayedValue = await inputField.getValue();
        expect(displayedValue).toBe('15.06.1950');
      });

      it('German format respects min/max date constraints', async () => {
        const control = component.form.get('datepickerWithConstraints');

        // Test value before min date (1870-01-01)
        control!.setValue('31.12.1869');
        fixture.detectChanges();
        expect(control?.invalid).toBe(true);
        expect(control?.hasError('matDatepickerMin')).toBe(true);

        // Test value after max date (today)
        control!.setValue('01.01.2030');
        fixture.detectChanges();
        expect(control?.invalid).toBe(true);
        expect(control?.hasError('matDatepickerMax')).toBe(true);
      });

      it('Invalid German date format is detected', async () => {
        const control = component.form.get('datepickerAllPrecisionLevels');
        control!.setValue('32.13.2022'); // Invalid date
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('invalidDate')).toBe(true);
      });

      it('Wrong precision format is detected when constraints are applied', async () => {
        const control = component.form.get('datepickerWithConstraints'); // Only day precision allowed
        control!.setValue('06.2022'); // Month precision
        fixture.detectChanges();

        expect(control?.invalid).toBe(true);
        expect(control?.hasError('formatMismatch')).toBe(true);
      });

      it('ISO format values are properly handled when set programmatically', async () => {
        const control = component.form.get('datepickerAllPrecisionLevels');

        // Test ISO day format
        control!.setValue('2023-07-15');
        fixture.detectChanges();
        expect(control?.valid).toBe(true);
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023-07-15');

        // Test ISO month format
        control!.setValue('2023-07');
        fixture.detectChanges();
        expect(control?.valid).toBe(true);
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023-07');

        // Test ISO year format
        control!.setValue('2023');
        fixture.detectChanges();
        expect(control?.valid).toBe(true);
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023');
      });
    });
  });

  describe('Edge cases', () => {
    it('calendarStartView returns correct view based on precision and multiYear setting', () => {
      // Test with normal mode
      component['currentPrecision'] = 'day';
      expect(component.calendarStartView).toBe('month');

      component['currentPrecision'] = 'month';
      expect(component.calendarStartView).toBe('year');

      component['currentPrecision'] = 'year';
      expect(component.calendarStartView).toBe('multi-year');
    });

    it('calendarStartView returns multi-year when multiYear is enabled', () => {
      component['multiYear'] = true;
      component['currentPrecision'] = 'day';
      expect(component.calendarStartView).toBe('multi-year');
    });

    it('dateFormats are properly set based on currentPrecision', () => {
      component['setCurrentPrecision']('day');
      expect(component['dateFormats'].display.dateInput).toBe('dd.MM.yyyy');

      component['setCurrentPrecision']('month');
      expect(component['dateFormats'].display.dateInput).toBe('MM.yyyy');

      component['setCurrentPrecision']('year');
      expect(component['dateFormats'].display.dateInput).toBe('yyyy');
    });

    it('dateFormats are set to null when precision is invalid', () => {
      component['setCurrentPrecision'](null);
      expect(component['dateFormats'].display.dateInput).toBeNull();
    });

    it('inputStringToDate returns null for null precision', () => {
      const result = component['inputStringToDate']('01.01.2023', null as any);
      expect(result).toBeNull();
    });

    it('dateToIsoString formats date correctly based on precision', () => {
      const testDate = new Date('2023-06-15');

      component['currentPrecision'] = 'day';
      expect(component['dateToIsoString'](testDate)).toBe('2023-06-15');

      component['currentPrecision'] = 'month';
      expect(component['dateToIsoString'](testDate)).toBe('2023-06');

      component['currentPrecision'] = 'year';
      expect(component['dateToIsoString'](testDate)).toBe('2023');
    });

    // Integration tests to ensure datepicker-shared functions are covered through component usage
    it('should trigger all precision handling through calendarStartView', () => {
      const precisions: Array<'day' | 'month' | 'year'> = ['day', 'month', 'year'];
      const expectedViews = ['month', 'year', 'multi-year'];

      component['multiYear'] = false;
      precisions.forEach((precision, index) => {
        component['setCurrentPrecision'](precision);
        expect(component.calendarStartView).toBe(expectedViews[index]);
      });
    });

    it('should process various date formats through programmatic value setting', () => {
      const control = component.form.get('datepickerAllPrecisionLevels')!;

      // Each case asserts the resulting model value and whether an invalidDate
      // error is reported, exercising the full detect/convert/apply pipeline.
      const validCases: Array<{
        input: string;
        expectedModel: string;
      }> = [
        { input: '15.06.2025', expectedModel: '2025-06-15' }, // German day
        { input: '06.2025', expectedModel: '2025-06' }, // German month
        { input: '2025', expectedModel: '2025' }, // Year (matches German regex first)
        { input: '2025-06-15', expectedModel: '2025-06-15' }, // ISO day
        { input: '2025-06', expectedModel: '2025-06' }, // ISO month
      ];

      validCases.forEach(({ input, expectedModel }) => {
        control.setValue(input);
        fixture.detectChanges();
        expect(component.model['datepickerAllPrecisionLevels'], `input=${input}`).toEqual(expectedModel);
        expect(control.hasError('invalidDate'), `input=${input}`).toBe(false);
      });

      // German formats without dots are detected and converted to ISO, but
      // because inputStringToDate only accepts the dotted German format, the
      // post-conversion validation flags them as invalidDate. The model still
      // reflects the converted ISO value.
      const noDotCases: Array<{
        input: string;
        expectedModel: string;
      }> = [
        { input: '15062025', expectedModel: '2025-06-15' },
        { input: '062025', expectedModel: '2025-06' },
      ];

      noDotCases.forEach(({ input, expectedModel }) => {
        control.setValue(input);
        fixture.detectChanges();
        expect(component.model['datepickerAllPrecisionLevels'], `input=${input}`).toEqual(expectedModel);
        expect(control.hasError('invalidDate'), `input=${input}`).toBe(true);
      });

      // Inputs that cannot be matched to any supported precision must yield invalidDate.
      const invalidStringInputs = ['invalid-date', '15.06', '06', '202', '1506202', '06202', ''];
      invalidStringInputs.forEach(input => {
        control.setValue(input);
        fixture.detectChanges();
        expect(control.hasError('invalidDate'), `input=${input}`).toBe(true);
      });

      // Non-string values are ignored by the precision detection logic and
      // therefore must not raise the invalidDate error.
      control.setValue(null);
      fixture.detectChanges();
      expect(control.hasError('invalidDate')).toBe(false);

      control.setValue(123 as unknown as string);
      fixture.detectChanges();
      expect(control.hasError('invalidDate')).toBe(false);
    });

    it('should trigger German format detection through user input processing', () => {
      const control = component.form.get('datepickerAllPrecisionLevels')!;
      // Each input is fed directly into processPrecisionValue with format=GERMAN
      // to exercise the German-only branches. We assert on the side effects:
      // the form control value (after ISO conversion for day/month) and the
      // resulting currentPrecision. For inputs without dots the conversion
      // succeeds but the post-conversion validation still reports invalidDate.
      const testInputs: Array<{
        value: string;
        precision: DatePrecision;
        expectedControlValue: string | null;
        expectInvalidDate: boolean;
      }> = [
        { value: '15.06.2025', precision: 'day', expectedControlValue: '2025-06-15', expectInvalidDate: false },
        { value: '06.2025', precision: 'month', expectedControlValue: '2025-06', expectInvalidDate: false },
        { value: '2025', precision: 'year', expectedControlValue: null, expectInvalidDate: false }, // year short-circuits, no conversion
        { value: '15062025', precision: 'day', expectedControlValue: '2025-06-15', expectInvalidDate: true },
        { value: '062025', precision: 'month', expectedControlValue: '2025-06', expectInvalidDate: true },
      ];

      testInputs.forEach(({ value, precision, expectedControlValue, expectInvalidDate }) => {
        control.setValue(null, { emitEvent: false });
        component['processPrecisionValue'](value, precision, 'GERMAN');

        if (expectedControlValue !== null) {
          expect(control.value, `input=${value}`).toBe(expectedControlValue);
        }
        expect(component['currentPrecision'], `input=${value}`).toBe(precision);
        expect(control.hasError('invalidDate'), `input=${value}`).toBe(expectInvalidDate);
      });
    });
  });

  describe('Values are loaded from model', () => {
    let datepickerAllPrecisionLevels: MatDatepickerInputHarness;
    let withDefaultValue_IsoDay: MatDatepickerInputHarness;
    let withDefaultValue_IsoMonth: MatDatepickerInputHarness;
    let withDefaultValue_Year: MatDatepickerInputHarness;

    beforeEach(async () => {
      datepickerAllPrecisionLevels = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
      withDefaultValue_IsoDay = await getDatepicker(loader, '#withDefaultValue_IsoDay-datepicker-input-field');
      withDefaultValue_IsoMonth = await getDatepicker(loader, '#withDefaultValue_IsoMonth-datepicker-input-field');
      withDefaultValue_Year = await getDatepicker(loader, '#withDefaultValue_Year-datepicker-input-field');
    });

    it('When a value YYYY-MM-DD is loaded, it is displayed with the accurate precision', async () => {
      expect(component.model['withDefaultValue_IsoDay']).toBe('2025-02-13');
      const displayedValue = await withDefaultValue_IsoDay.getValue();
      expect(displayedValue).toBe('13.02.2025');
    });

    it('When a value YYYY-MM is loaded, it is displayed with the accurate precision', async () => {
      expect(component.model['withDefaultValue_IsoMonth']).toBe('2025-02');
      const displayedValue = await withDefaultValue_IsoMonth.getValue();
      expect(displayedValue).toBe('02.2025');
    });

    it('When a value YYYY is loaded, it is displayed with the accurate precision', async () => {
      expect(component.model['withDefaultValue_Year']).toBe('2025');
      const displayedValue = await withDefaultValue_Year.getValue();
      expect(displayedValue).toBe('2025');
    });

    it('If the value is updated programmatically, the precision and the format displayed are updated accordingly', async () => {
      component.form.get('datepickerAllPrecisionLevels')!.setValue('2021-08');
      const displayedValue = await datepickerAllPrecisionLevels.getValue();
      expect(displayedValue).toBe('08.2021');
    });

    it('If the value is updated programmatically, no error is thrown when the precision is within default allowed precisions', async () => {
      component.form.get('withDefaultValue_IsoMonth_defaultPrecision')!.setValue('2025-02');
      const control = component.form.get('withDefaultValue_IsoMonth_defaultPrecision');
      expect(control?.hasError('formatMismatch')).toBe(false);
    });

    it('If the value is updated programmatically, an error is thrown if no precision is detected from model', async () => {
      component.form.get('datepickerAllPrecisionLevels')!.setValue('foo');
      const control = component.form.get('datepickerAllPrecisionLevels');
      expect(control?.hasError('invalidDate')).toBe(true);
    });
  });

  describe('User selects date with the datepicker calendar', () => {
    let datepickerAllPrecisionLevels: MatDatepickerInputHarness;
    let defaultDatepicker: MatDatepickerInputHarness;
    let multiYearDatepicker: MatDatepickerInputHarness;
    let datepickerWithTimeRange: MatDatepickerInputHarness;

    beforeEach(async () => {
      datepickerAllPrecisionLevels = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
      defaultDatepicker = await getDatepicker(loader, '#defaultDatepicker-datepicker-input-field');
      multiYearDatepicker = await getDatepicker(loader, '#multiYearDatepicker-datepicker-input-field');
      datepickerWithTimeRange = await getDatepicker(loader, '#datepickerWithTimeRange-datepicker-input-field');
    });

    describe('The calendar can handle 3 precisions level', () => {
      it('Initially the calendar should be closed', async () => {
        expect(await datepickerAllPrecisionLevels.isCalendarOpen()).toBe(false);
      });

      it('The calendar opens by default with the view matching the highest precision allowed', async () => {
        await datepickerAllPrecisionLevels.openCalendar();

        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');

        expect(await (await dayButton.host()).hasClass('selected')).toBe(true);
        expect(await (await monthButton.host()).hasClass('selected')).toBe(false);
        expect(await (await yearButton.host()).hasClass('selected')).toBe(false);
      });

      it('A date can be selected in day precision', async () => {
        await datepickerAllPrecisionLevels.openCalendar();
        await fixture.whenStable();

        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '15' });
        await datepickerAllPrecisionLevels.closeCalendar();

        const expectedDate = format(setDate(new Date(), 15), 'yyyy-MM-dd');
        expect(component.model['datepickerAllPrecisionLevels']).toEqual(expectedDate);
      });

      it('User can switch to month precision level and select', async () => {
        await datepickerAllPrecisionLevels.openCalendar();
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await monthButton.click();

        expect(await (await dayButton.host()).hasClass('selected')).toBe(false);
        expect(await (await monthButton.host()).hasClass('selected')).toBe(true);
        expect(await (await yearButton.host()).hasClass('selected')).toBe(false);

        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: 'JAN' });

        const currentYear = new Date().getFullYear();
        const expectedDate = format(new Date(currentYear, 0), 'yyyy-MM'); // January = 0
        expect(component.model['datepickerAllPrecisionLevels']).toEqual(expectedDate);
      });

      it('User can switch to year precision level and select', async () => {
        await datepickerAllPrecisionLevels.openCalendar();
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();

        expect(await (await dayButton.host()).hasClass('selected')).toBe(false);
        expect(await (await monthButton.host()).hasClass('selected')).toBe(false);
        expect(await (await yearButton.host()).hasClass('selected')).toBe(true);

        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2024');
      });

      it('User can switch only to allowed precision levels', async () => {
        await defaultDatepicker.openCalendar(); // all precision levels allowed by default
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        expect(await monthButton.isDisabled()).toBe(false);
        expect(await yearButton.isDisabled()).toBe(false);
      });

      it('User can switch precision level multiple time', async () => {
        await datepickerAllPrecisionLevels.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        await dayButton.click();
        expect(await (await dayButton.host()).hasClass('selected')).toBe(true);
        expect(await (await yearButton.host()).hasClass('selected')).toBe(false);
      });

      it('On reopen the calendar is reset to default precision', async () => {
        //User first uses calendar in year precision
        await datepickerAllPrecisionLevels.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        expect(await (await yearButton.host()).hasClass('selected')).toBe(true);
        await datepickerAllPrecisionLevels.closeCalendar();
        fixture.detectChanges();
        await fixture.whenStable();

        //And then reopen the calendar via the toggle button (resets precision)
        // Directly invoke toggle click to reset precision, then open via harness
        component.onDatepickerToggleClick();
        fixture.detectChanges();
        await datepickerAllPrecisionLevels.openCalendar();
        expect(await datepickerAllPrecisionLevels.isCalendarOpen()).toBe(true);
        const refreshedYearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        expect(await (await refreshedYearButton.host()).hasClass('selected')).toBe(false);
        expect(await (await dayButton.host()).hasClass('selected')).toBe(true);
      });
    });

    describe('The calendar can be open in multi-year modus', () => {
      it('user can select date with day precision in multi-year modus', async () => {
        await multiYearDatepicker.openCalendar();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        await calendar.selectCell({ text: 'MAI' });
        await calendar.selectCell({ text: '15' });
        expect(component.model['multiYearDatepicker']).toEqual('2024-05-15');
        expect(await multiYearDatepicker.isCalendarOpen()).toBe(false);
      });

      it('user can select date with month precision in multi-year modus', async () => {
        await multiYearDatepicker.openCalendar();
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        await monthButton.click();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        await calendar.selectCell({ text: 'MAI' });

        expect(component.model['multiYearDatepicker']).toEqual('2024-05');
        expect(await multiYearDatepicker.isCalendarOpen()).toBe(false);
      });

      it('user can select date with year precision in multi-year modus', async () => {
        await multiYearDatepicker.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        expect(component.model['multiYearDatepicker']).toEqual('2024');
        expect(await multiYearDatepicker.isCalendarOpen()).toBe(false);
      });

      it('if the user closes the calender before the end of the date selection, the partially selected date is ignored', async () => {
        await multiYearDatepicker.setValue('12.12.2027');
        await multiYearDatepicker.openCalendar();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        await calendar.selectCell({ text: 'MAI' });

        //But after month selection we stop the process, resulting in an incomplete date selection
        await multiYearDatepicker.closeCalendar();
        expect(component.model['multiYearDatepicker']).toEqual('2027-12-12');
      });
    });

    describe('The navigation through the arrows in header work as expected', () => {
      let prevYears: MatButtonHarness;
      let prevYear: MatButtonHarness;
      let prevMonth: MatButtonHarness;
      let nextMonth: MatButtonHarness;
      let nextYear: MatButtonHarness;
      let nextYears: MatButtonHarness;
      let labelElement: DebugElement;
      let textLabel: string;

      describe('on calendar view month', async () => {
        beforeEach(async () => {
          await datepickerAllPrecisionLevels.setValue('12.06.2022');
          await datepickerAllPrecisionLevels.openCalendar();

          prevYear = await getButton(loader, '#prev-year');
          prevMonth = await getButton(loader, '#prev-month');
          nextMonth = await getButton(loader, '#next-month');
          nextYear = await getButton(loader, '#next-year');

          labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          textLabel = labelElement.nativeElement.textContent.trim();
          expect(textLabel).toBe('JUNI 2022');
        });

        it('user can go to next month', async () => {
          await nextMonth.click();

          labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          textLabel = labelElement.nativeElement.textContent.trim();
          expect(textLabel).toBe('JULI 2022');

          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '20' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-07-20');
        });

        it('user can go to next year', async () => {
          await nextYear.click();

          labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          textLabel = labelElement.nativeElement.textContent.trim();
          expect(textLabel).toBe('JUNI 2023');

          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '20' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023-06-20');
        });

        it('user can go to previous month', async () => {
          await prevMonth.click();

          labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          textLabel = labelElement.nativeElement.textContent.trim();
          expect(textLabel).toBe('MAI 2022');

          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '20' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2022-05-20');
        });

        it('user can go to previous year', async () => {
          await prevYear.click();

          labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          textLabel = labelElement.nativeElement.textContent.trim();
          expect(textLabel).toBe('JUNI 2021');

          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '20' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2021-06-20');
        });

        it('does not show prevYears and nextYears buttons in month view', async () => {
          const prevYearsExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#prev-years' }));
          const nextYearsExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#next-years' }));

          expect(prevYearsExists.length).toBe(0);
          expect(nextYearsExists.length).toBe(0);
        });
      });

      describe('on calendar view year', async () => {
        beforeEach(async () => {
          await datepickerAllPrecisionLevels.setValue('01.06.2022');
          await datepickerAllPrecisionLevels.openCalendar();
          let monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
          await monthButton.click();
          prevYear = await getButton(loader, '#prev-year');
          nextYear = await getButton(loader, '#next-year');
        });

        it('Label should be hidden', () => {
          const labelElement = fixture.debugElement.query(By.css('.datepicker-header-period-label'));
          expect(labelElement.nativeElement.classList).toContain('hidden');
        });

        it('user can go to next year', async () => {
          await nextYear.click();
          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: 'JAN' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2023-01');
        });

        it('user can go to previous year', async () => {
          await prevYear.click();
          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: 'JAN' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2021-01');
        });

        it('does not show the other nav buttons', async () => {
          const prevYearsExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#prev-years' }));
          const nextYearsExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#next-years' }));
          const prevMonthExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#prev-month' }));
          const nextMonthExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#next-month' }));

          expect(prevYearsExists.length).toBe(0);
          expect(nextYearsExists.length).toBe(0);
          expect(prevMonthExists.length).toBe(0);
          expect(nextMonthExists.length).toBe(0);
        });
      });

      describe('on calendar view multi-year', async () => {
        beforeEach(async () => {
          await datepickerAllPrecisionLevels.setValue('2022');
          await datepickerAllPrecisionLevels.openCalendar();
          let yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
          await yearButton.click();
          prevYears = await getButton(loader, '#prev-years');
          nextYears = await getButton(loader, '#next-years');
        });

        it('user can display next range of years', async () => {
          await nextYears.click();
          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '2050' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('2050');
        });

        it('user can display previous range of years', async () => {
          await prevYears.click();
          const calendar = await loader.getHarness(MatCalendarHarness);
          await calendar.selectCell({ text: '1995' });
          expect(component.model['datepickerAllPrecisionLevels']).toEqual('1995');
        });

        it('does not show the other nav buttons', async () => {
          const prevYearExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#prev-year' }));
          const nextYearExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#next-year' }));
          const prevMonthExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#prev-month' }));
          const nextMonthExists = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '#next-month' }));

          expect(prevYearExists.length).toBe(0);
          expect(nextYearExists.length).toBe(0);
          expect(prevMonthExists.length).toBe(0);
          expect(nextMonthExists.length).toBe(0);
        });
      });

      describe('Navigation arrows disabled if range limits have been reached', () => {
        it('Month calendar view', async () => {
          // reminder: datepickerWithTimeRange has minDate set to 01.01.2000
          await datepickerWithTimeRange.setValue('01.01.2000');
          await datepickerWithTimeRange.openCalendar();
          prevYear = await getButton(loader, '#prev-year');
          prevMonth = await getButton(loader, '#prev-month');
          expect(await prevYear.isDisabled()).toBe(true);
          expect(await prevMonth.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('31.12.2009');
          await datepickerWithTimeRange.openCalendar();
          nextYear = await getButton(loader, '#next-year');
          nextMonth = await getButton(loader, '#next-month');
          expect(await nextYear.isDisabled()).toBe(true);
          expect(await nextMonth.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();
        });

        it('Year calendar view', async () => {
          // reminder: datepickerWithTimeRange has minDate set to 01.01.2000
          await datepickerWithTimeRange.setValue('01.2000');
          await datepickerWithTimeRange.openCalendar();
          let monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
          await monthButton.click();
          prevYear = await getButton(loader, '#prev-year');
          expect(await prevYear.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('12.2009');
          await datepickerWithTimeRange.openCalendar();
          monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
          await monthButton.click();
          nextYear = await getButton(loader, '#next-year');
          expect(await nextYear.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();
        });

        it('Multi-year calendar view', async () => {
          // reminder: datepickerWithTimeRange has minDate set to 01.01.2000
          await datepickerWithTimeRange.setValue('2000');
          await datepickerWithTimeRange.openCalendar();
          prevYears = await getButton(loader, '#prev-years');
          expect(await prevYears.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('2000');
          await datepickerWithTimeRange.openCalendar();
          nextYears = await getButton(loader, '#next-years');
          expect(await nextYears.isDisabled()).toBe(true);
          await datepickerWithTimeRange.closeCalendar();
        });

        describe('Edge cases', () => {
          let datepickerAllPrecisionLevels: MatDatepickerInputHarness;
          let minDateSignal: WritableSignal<Date | null>;
          let maxDateSignal: WritableSignal<Date | null>;

          beforeEach(async () => {
            datepickerAllPrecisionLevels = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
            await datepickerAllPrecisionLevels.openCalendar();
            const headerEl = fixture.debugElement.query(By.directive(DatepickerHeaderComponent));
            header = headerEl.componentInstance;
            minDateSignal = component['_minDate'] as WritableSignal<Date | null>;
            maxDateSignal = component['_maxDate'] as WritableSignal<Date | null>;
            header['calendar'].activeDate = new Date('2025-06-14');
          });

          it('should allow click to the previous month if within bounds', () => {
            minDateSignal.set(new Date('2022-12-01'));
            expect(header.canGoPrevious('month')).toBe(true);

            minDateSignal.set(new Date('2025-05-01'));
            expect(header.canGoPrevious('month')).toBe(true);

            minDateSignal.set(new Date('2025-05-28'));
            expect(header.canGoPrevious('month')).toBe(true);
          });

          it('should disallow click to the previous month if not within bounds', () => {
            minDateSignal.set(new Date('2025-06-01'));
            expect(header.canGoPrevious('month')).toBe(false);

            minDateSignal.set(new Date('2025-06-14'));
            expect(header.canGoPrevious('month')).toBe(false);

            minDateSignal.set(new Date('2025-06-28'));
            expect(header.canGoPrevious('month')).toBe(false);

            minDateSignal.set(new Date('2025-07-28'));
            expect(header.canGoPrevious('month')).toBe(false);
          });

          it('should allow click to the next month if within bounds', () => {
            maxDateSignal.set(new Date('2025-07-01'));
            expect(header.canGoNext('month')).toBe(true);

            maxDateSignal.set(new Date('2025-07-20'));
            expect(header.canGoNext('month')).toBe(true);

            maxDateSignal.set(new Date('2026-01-01'));
            expect(header.canGoNext('month')).toBe(true);
          });

          it('should disallow click to the next month if not within bounds', () => {
            maxDateSignal.set(new Date('2025-06-01'));
            expect(header.canGoNext('month')).toBe(false);

            maxDateSignal.set(new Date('2025-06-14'));
            expect(header.canGoNext('month')).toBe(false);

            maxDateSignal.set(new Date('2025-06-28'));
            expect(header.canGoNext('month')).toBe(false);

            maxDateSignal.set(new Date('2025-05-10'));
            expect(header.canGoNext('month')).toBe(false);
          });

          it('should allow click to the previous year if within bounds', () => {
            minDateSignal.set(new Date('2024-01-15'));
            expect(header.canGoPrevious('year')).toBe(true);

            minDateSignal.set(new Date('2024-11-15'));
            expect(header.canGoPrevious('year')).toBe(true);
          });

          it('should disallow click to the previous year if not within bounds', () => {
            minDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoPrevious('year')).toBe(false);

            minDateSignal.set(new Date('2025-11-15'));
            expect(header.canGoPrevious('year')).toBe(false);

            minDateSignal.set(new Date('2026-01-15'));
            expect(header.canGoPrevious('year')).toBe(false);
          });

          it('should allow click to the next year if within bounds', () => {
            maxDateSignal.set(new Date('2026-01-15'));
            expect(header.canGoNext('year')).toBe(true);

            maxDateSignal.set(new Date('2026-11-15'));
            expect(header.canGoNext('year')).toBe(true);

            maxDateSignal.set(new Date('2027-01-15'));
            expect(header.canGoNext('year')).toBe(true);
          });

          it('should disallow click to the next year if not within bounds', () => {
            maxDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoNext('year')).toBe(false);

            maxDateSignal.set(new Date('2025-11-15'));
            expect(header.canGoNext('year')).toBe(false);

            maxDateSignal.set(new Date('2024-01-01'));
            expect(header.canGoNext('year')).toBe(false);
          });

          it('should allow click to the previous year-range if within bounds', () => {
            minDateSignal.set(new Date('1970-01-15'));
            expect(header.canGoPrevious('multi-year')).toBe(true);
          });

          it('should disallow click to the previous year-range if not within bounds', () => {
            minDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoPrevious('multi-year')).toBe(false);
          });

          it('should allow click to the next year-range if within bounds', () => {
            maxDateSignal.set(new Date('2084-01-01'));
            expect(header.canGoNext('multi-year')).toBe(true);
          });

          it('should disallow click to the next year-range if not within bounds', () => {
            maxDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoNext('multi-year')).toBe(false);
          });
        });
      });
    });
  });

  describe('utils', () => {
    const VALID_FORMATS = new Map([
      ['day', { input: 'dd.MM.yyyy' }],
      ['month', { input: 'MM.yyyy' }],
      ['year', { input: 'yyyy' }],
    ]);

    describe('inputStringToDate()', () => {
      beforeEach(() => {
        // @ts-ignore: bypass private for testing
        component['VALID_FORMATS'] = VALID_FORMATS;
      });

      it('should parse a valid date string with day precision', () => {
        const result = component['inputStringToDate']('30.05.2024', 'day');
        expect(isValid(result)).toBe(true);
      });

      it('should return an invalid Date for malformed input', () => {
        const result = component['inputStringToDate']('not-a-date', 'day');
        expect(result instanceof Date).toBe(true);
        expect(isValid(result)).toBe(false);
      });

      it('should return an invalid Date for mismatch format input', () => {
        const result = component['inputStringToDate']('2024', 'day');
        expect(result instanceof Date).toBe(true);
        expect(isValid(result)).toBe(false);
      });

      it('should return null if precision is null', () => {
        const result = component['inputStringToDate']('30.05.2024', null as any);
        expect(result).toBeNull();
      });

      it('should parse with year precision', () => {
        const result = component['inputStringToDate']('2020', 'year');
        expect(isValid(result)).toBe(true);
      });
    });
  });
});
