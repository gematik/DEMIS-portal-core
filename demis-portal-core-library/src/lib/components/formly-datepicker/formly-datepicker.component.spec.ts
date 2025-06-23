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

import { ComponentFixture } from '@angular/core/testing';

import { FormlyDatepickerComponent } from './formly-datepicker.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { Component, DebugElement, WritableSignal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { format, isValid, setDate } from 'date-fns';
import { MatCalendarHarness, MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { checkValidationError, getButton, getDatepicker, getErrorFor, getHintForFormFieldWithLabel } from '../../../test/utils/test-utils';
import { DatepickerHeaderComponent } from './header/datepicker-header.component';

describe('FormlyDatepickerComponent', () => {
  let component: FormlyDatepickerComponent;
  let header: DatepickerHeaderComponent;
  let fixture: ComponentFixture<MockComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    return MockBuilder(MockComponent)
      .keep(FormlyDatepickerComponent)
      .keep(ReactiveFormsModule)
      .keep(NoopAnimationsModule)
      .keep(
        FormlyModule.forRoot({
          types: [{ name: 'datepicker', component: FormlyDatepickerComponent }],
          validationMessages: [{ name: 'required', message: 'Diese Angabe wird benötigt' }],
        })
      );
  });

  beforeEach(() => {
    fixture = MockRender(MockComponent);
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
      let hintText: string;

      beforeEach(async () => {
        inputField = await getDatepicker(loader, '#datepickerAllPrecisionLevels-datepicker-input-field');
        hintText = await getHintForFormFieldWithLabel(loader, 'Datepicker with all precision levels');
      });

      it('should display allowed formats as hint', async () => {
        expect(hintText).toBe('TT.MM.JJJJ | MM.JJJJ | JJJJ');
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
      it('input field should only accept day precision', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');

        const hintText = await getHintForFormFieldWithLabel(loader, 'Geburtstag');
        expect(hintText).toBe('TT.MM.JJJJ');

        await inputField.setValue('12.06.2022');
        expect(component.form.get('datepickerWithConstraints')?.valid).toBeTrue();

        await inputField.setValue('06.2022');
        expect(component.form.get('datepickerWithConstraints')?.invalid).toBeTrue();

        await inputField.setValue('2022');
        expect(component.form.get('datepickerWithConstraints')?.invalid).toBeTrue();
      });

      it('A clear message should be displayed when the format of the input is not allowed', async () => {
        const inputField = await getDatepicker(loader, '#datepickerWithConstraints-datepicker-input-field');
        await inputField.setValue('2022');
        await inputField.blur();
        fixture.detectChanges();

        const errorMessage = await getErrorFor(loader, 'Geburtstag');
        expect(errorMessage).toBe('Es sind nur folgende Formate erlaubt: TT.MM.JJJJ');
      });
    });

    describe('Input validation work as expected', () => {
      it('a min date can be set and validated', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithConstraints',
          label: 'Geburtstag',
          value: '01.01.1869',
          expectedMessage: 'Das Datum darf nicht vor dem 01.01.1870 liegen',
        });
      });

      it('min date validation message can be overridden in formly config', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithValidationMessage',
          label: 'Foo',
          value: '01.01.1869',
          expectedMessage: 'A message from consuming app on error of type minDate',
        });
      });

      it('a max date can be set and validated', async () => {
        const today = format(new Date(), 'dd.MM.yyyy');
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithConstraints',
          label: 'Geburtstag',
          value: '01.01.2500',
          expectedMessage: `Das Datum darf nicht nach dem ${today} liegen`,
        });
      });

      it('a max date can be set and validated', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithValidationMessage',
          label: 'Foo',
          value: '01.01.2500',
          expectedMessage: 'A message from consuming app on error of type maxDate',
        });
      });

      it('a date can be required', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithConstraints',
          label: 'Geburtstag',
          value: '',
          expectedMessage: 'Diese Angabe wird benötigt', // Default message for required field as defined in Formly root config
        });
      });

      it('validation message for required defined by consuming app', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithValidationMessage',
          label: 'Foo',
          value: '',
          expectedMessage: 'A message from consuming app on error of type required',
        });
      });

      it('invalid dates are detected', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithConstraints',
          label: 'Geburtstag',
          value: '31.02.2022',
          expectedMessage: 'Das eingegebene Datum ist ungültig',
        });
      });

      it('invalid formats are detected', async () => {
        await checkValidationError({
          loader,
          component,
          controlName: 'datepickerWithConstraints',
          label: 'Geburtstag',
          value: '1547.554.32',
          expectedMessage: 'Es sind nur folgende Formate erlaubt: TT.MM.JJJJ',
        });
      });
    });

    describe('Check default values', () => {
      it('Check default precision', async () => {
        const hintElement = fixture.debugElement.query(By.css('#defaultDatepicker-datepicker-form-field .datepicker-hint'));
        const hintText = hintElement?.nativeElement.textContent.trim();
        expect(hintText).toBe('TT.MM.JJJJ');

        const inputField = await getDatepicker(loader, '#defaultDatepicker-datepicker-input-field');
        await inputField.setValue('12.06.2022');
        expect(component.model['defaultDatepicker']).toEqual('2022-06-12');
        expect(component.form.get('defaultDatepicker')?.invalid).toBeFalse();

        await inputField.setValue('06.2022');
        expect(component.form.get('defaultDatepicker')?.invalid).toBeTrue();

        await inputField.setValue('2022');
        expect(component.form.get('defaultDatepicker')?.invalid).toBeTrue();
      });

      it('Check default label', async () => {
        const labelElement = fixture.debugElement.query(By.css('#defaultDatepicker-datepicker-form-field .datepicker-label'));
        const labelText = labelElement?.nativeElement.textContent.trim();
        expect(labelText).toBe('');
      });

      it('A * is added as suffix for mandatory field with label not blank', async () => {
        const labelElement = fixture.debugElement.query(By.css('#datepickerWithConstraints-datepicker-form-field .datepicker-label'));
        const labelText = labelElement?.nativeElement.textContent.trim();
        expect(labelText).toBe('Geburtstag');
      });

      it('No * is added as suffix for mandatory field with label not blank', async () => {
        const labelElement = fixture.debugElement.query(By.css('#defaultDatepickerMandatory-datepicker-form-field .datepicker-label'));
        const labelText = labelElement?.nativeElement.textContent.trim();
        expect(labelText).toBe('');
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

    it('If the value is updated programmatically, an error is thrown if the precision detected from model is not allowed', async () => {
      component.form.get('withDefaultValue_IsoMonth_defaultPrecision')!.setValue('2025-02');
      const control = component.form.get('withDefaultValue_IsoMonth_defaultPrecision');
      expect(control?.hasError('formatMismatch')).toBeTrue();
    });

    it('If the value is updated programmatically, an error is thrown if no precision is detected from model', async () => {
      component.form.get('datepickerAllPrecisionLevels')!.setValue('foo');
      const control = component.form.get('datepickerAllPrecisionLevels');
      expect(control?.hasError('invalidDate')).toBeTrue();
    });

    it('If the value is updated programmatically, an error is thrown if date cannot be parsed', async () => {
      component.form.get('datepickerAllPrecisionLevels')!.setValue('2025-15');
      const control = component.form.get('datepickerAllPrecisionLevels');
      expect(control?.hasError('matDatepickerParse')).toBeTrue();
      await datepickerAllPrecisionLevels.blur();
      const errorMessage = await getErrorFor(loader, 'Datepicker with all precision levels');
      expect(errorMessage).toBe('Das eingegebene Datum "2025-15" ist ungültig');
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
        expect(await datepickerAllPrecisionLevels.isCalendarOpen()).toBeFalse();
      });

      it('The calendar opens by default with the view matching the highest precision allowed', async () => {
        await datepickerAllPrecisionLevels.openCalendar();

        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');

        expect(await (await dayButton.host()).hasClass('selected')).toBeTrue();
        expect(await (await monthButton.host()).hasClass('selected')).toBeFalse();
        expect(await (await yearButton.host()).hasClass('selected')).toBeFalse();
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

        expect(await (await dayButton.host()).hasClass('selected')).toBeFalse();
        expect(await (await monthButton.host()).hasClass('selected')).toBeTrue();
        expect(await (await yearButton.host()).hasClass('selected')).toBeFalse();

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

        expect(await (await dayButton.host()).hasClass('selected')).toBeFalse();
        expect(await (await monthButton.host()).hasClass('selected')).toBeFalse();
        expect(await (await yearButton.host()).hasClass('selected')).toBeTrue();

        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        expect(component.model['datepickerAllPrecisionLevels']).toEqual('2024');
      });

      it('User can switch only to allowed precision levels', async () => {
        await defaultDatepicker.openCalendar(); // only day precision allowed
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        expect(await monthButton.isDisabled()).toBeTrue();
        expect(await yearButton.isDisabled()).toBeTrue();
      });

      it('User can switch precision level multiple time', async () => {
        await datepickerAllPrecisionLevels.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        await dayButton.click();
        expect(await (await dayButton.host()).hasClass('selected')).toBeTrue();
        expect(await (await yearButton.host()).hasClass('selected')).toBeFalse();
      });

      it('On reopen the calendar is reset to default precision', async () => {
        //User first uses calendar in year precision
        await datepickerAllPrecisionLevels.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        expect(await (await yearButton.host()).hasClass('selected')).toBeTrue();
        await datepickerAllPrecisionLevels.closeCalendar();

        //And then reopen the calendar
        const toggleDebugEl = fixture.debugElement.query(By.css('mat-datepicker-toggle'));
        toggleDebugEl.nativeElement.click();
        fixture.detectChanges();
        expect(await datepickerAllPrecisionLevels.isCalendarOpen()).toBeTrue();
        const refreshedYearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        const dayButton = await getButton(loader, '#datepicker-precision-toggle-day');
        expect(await (await refreshedYearButton.host()).hasClass('selected')).toBeFalse();
        expect(await (await dayButton.host()).hasClass('selected')).toBeTrue();
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
        expect(await multiYearDatepicker.isCalendarOpen()).toBeFalse();
      });

      it('user can select date with month precision in multi-year modus', async () => {
        await multiYearDatepicker.openCalendar();
        const monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
        await monthButton.click();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        await calendar.selectCell({ text: 'MAI' });

        expect(component.model['multiYearDatepicker']).toEqual('2024-05');
        expect(await multiYearDatepicker.isCalendarOpen()).toBeFalse();
      });

      it('user can select date with year precision in multi-year modus', async () => {
        await multiYearDatepicker.openCalendar();
        const yearButton = await getButton(loader, '#datepicker-precision-toggle-year');
        await yearButton.click();
        const calendar = await loader.getHarness(MatCalendarHarness);
        await calendar.selectCell({ text: '2024' });
        expect(component.model['multiYearDatepicker']).toEqual('2024');
        expect(await multiYearDatepicker.isCalendarOpen()).toBeFalse();
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
          expect(await prevYear.isDisabled()).toBeTrue();
          expect(await prevMonth.isDisabled()).toBeTrue();
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('31.12.2009');
          await datepickerWithTimeRange.openCalendar();
          nextYear = await getButton(loader, '#next-year');
          nextMonth = await getButton(loader, '#next-month');
          expect(await nextYear.isDisabled()).toBeTrue();
          expect(await nextMonth.isDisabled()).toBeTrue();
          await datepickerWithTimeRange.closeCalendar();
        });

        it('Year calendar view', async () => {
          // reminder: datepickerWithTimeRange has minDate set to 01.01.2000
          await datepickerWithTimeRange.setValue('01.2000');
          await datepickerWithTimeRange.openCalendar();
          let monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
          await monthButton.click();
          prevYear = await getButton(loader, '#prev-year');
          expect(await prevYear.isDisabled()).toBeTrue();
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('12.2009');
          await datepickerWithTimeRange.openCalendar();
          monthButton = await getButton(loader, '#datepicker-precision-toggle-month');
          await monthButton.click();
          nextYear = await getButton(loader, '#next-year');
          expect(await nextYear.isDisabled()).toBeTrue();
          await datepickerWithTimeRange.closeCalendar();
        });

        it('Multi-year calendar view', async () => {
          // reminder: datepickerWithTimeRange has minDate set to 01.01.2000
          await datepickerWithTimeRange.setValue('2000');
          await datepickerWithTimeRange.openCalendar();
          prevYears = await getButton(loader, '#prev-years');
          expect(await prevYears.isDisabled()).toBeTrue();
          await datepickerWithTimeRange.closeCalendar();

          // reminder: datepickerWithTimeRange has maxDate set to 31.12.2009
          await datepickerWithTimeRange.setValue('2000');
          await datepickerWithTimeRange.openCalendar();
          nextYears = await getButton(loader, '#next-years');
          expect(await nextYears.isDisabled()).toBeTrue();
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
            expect(header.canGoPrevious('month')).toBeTrue();

            minDateSignal.set(new Date('2025-05-01'));
            expect(header.canGoPrevious('month')).toBeTrue();

            minDateSignal.set(new Date('2025-05-28'));
            expect(header.canGoPrevious('month')).toBeTrue();
          });

          it('should disallow click to the previous month if not within bounds', () => {
            minDateSignal.set(new Date('2025-06-01'));
            expect(header.canGoPrevious('month')).toBeFalse();

            minDateSignal.set(new Date('2025-06-14'));
            expect(header.canGoPrevious('month')).toBeFalse();

            minDateSignal.set(new Date('2025-06-28'));
            expect(header.canGoPrevious('month')).toBeFalse();

            minDateSignal.set(new Date('2025-07-28'));
            expect(header.canGoPrevious('month')).toBeFalse();
          });

          it('should allow click to the next month if within bounds', () => {
            maxDateSignal.set(new Date('2025-07-01'));
            expect(header.canGoNext('month')).toBeTrue();

            maxDateSignal.set(new Date('2025-07-20'));
            expect(header.canGoNext('month')).toBeTrue();

            maxDateSignal.set(new Date('2026-01-01'));
            expect(header.canGoNext('month')).toBeTrue();
          });

          it('should disallow click to the next month if not within bounds', () => {
            maxDateSignal.set(new Date('2025-06-01'));
            expect(header.canGoNext('month')).toBeFalse();

            maxDateSignal.set(new Date('2025-06-14'));
            expect(header.canGoNext('month')).toBeFalse();

            maxDateSignal.set(new Date('2025-06-28'));
            expect(header.canGoNext('month')).toBeFalse();

            maxDateSignal.set(new Date('2025-05-10'));
            expect(header.canGoNext('month')).toBeFalse();
          });

          it('should allow click to the previous year if within bounds', () => {
            minDateSignal.set(new Date('2024-01-15'));
            expect(header.canGoPrevious('year')).toBeTrue();

            minDateSignal.set(new Date('2024-11-15'));
            expect(header.canGoPrevious('year')).toBeTrue();
          });

          it('should disallow click to the previous year if not within bounds', () => {
            minDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoPrevious('year')).toBeFalse();

            minDateSignal.set(new Date('2025-11-15'));
            expect(header.canGoPrevious('year')).toBeFalse();

            minDateSignal.set(new Date('2026-01-15'));
            expect(header.canGoPrevious('year')).toBeFalse();
          });

          it('should allow click to the next year if within bounds', () => {
            maxDateSignal.set(new Date('2026-01-15'));
            expect(header.canGoNext('year')).toBeTrue();

            maxDateSignal.set(new Date('2026-11-15'));
            expect(header.canGoNext('year')).toBeTrue();

            maxDateSignal.set(new Date('2027-01-15'));
            expect(header.canGoNext('year')).toBeTrue();
          });

          it('should disallow click to the next year if not within bounds', () => {
            maxDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoNext('year')).toBeFalse();

            maxDateSignal.set(new Date('2025-11-15'));
            expect(header.canGoNext('year')).toBeFalse();

            maxDateSignal.set(new Date('2024-01-01'));
            expect(header.canGoNext('year')).toBeFalse();
          });

          it('should allow click to the previous year-range if within bounds', () => {
            minDateSignal.set(new Date('1970-01-15'));
            expect(header.canGoPrevious('multi-year')).toBeTrue();
          });

          it('should disallow click to the previous year-range if not within bounds', () => {
            minDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoPrevious('multi-year')).toBeFalse();
          });

          it('should allow click to the next year-range if within bounds', () => {
            maxDateSignal.set(new Date('2084-01-01'));
            expect(header.canGoNext('multi-year')).toBeTrue();
          });

          it('should disallow click to the next year-range if not within bounds', () => {
            maxDateSignal.set(new Date('2025-01-15'));
            expect(header.canGoNext('multi-year')).toBeFalse();
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
        expect(isValid(result)).toBeTrue();
      });

      it('should return an invalid Date for malformed input', () => {
        const result = component['inputStringToDate']('not-a-date', 'day');
        expect(result instanceof Date).toBeTrue();
        expect(isValid(result)).toBeFalse();
      });

      it('should return an invalid Date for mismatch format input', () => {
        const result = component['inputStringToDate']('2024', 'day');
        expect(result instanceof Date).toBeTrue();
        expect(isValid(result)).toBeFalse();
      });

      it('should return null if precision is null', () => {
        const result = component['inputStringToDate']('30.05.2024', null as any);
        expect(result).toBeNull();
      });

      it('should parse with year precision', () => {
        const result = component['inputStringToDate']('2020', 'year');
        expect(isValid(result)).toBeTrue();
      });
    });
  });
});

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
})
class MockComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'datepickerAllPrecisionLevels',
      key: 'datepickerAllPrecisionLevels',
      type: 'datepicker',
      props: {
        label: 'Datepicker with all precision levels',
        allowedPrecisions: ['day', 'month', 'year'],
      },
    },
    {
      id: 'datepickerWithConstraints',
      key: 'datepickerWithConstraints',
      type: 'datepicker',
      props: {
        label: 'Geburtstag',
        allowedPrecisions: ['day'],
        required: true,
        minDate: new Date('1870-01-01'),
        maxDate: new Date(),
      },
    },
    {
      id: 'datepickerWithValidationMessage',
      key: 'datepickerWithValidationMessage',
      type: 'datepicker',
      props: {
        label: 'Foo',
        allowedPrecisions: ['day'],
        required: true,
        minDate: new Date('1870-01-01'),
        maxDate: new Date('2025-01-01'),
      },
      validation: {
        messages: {
          required: 'A message from consuming app on error of type required',
          minDate: 'A message from consuming app on error of type minDate',
          maxDate: 'A message from consuming app on error of type maxDate',
        },
      },
    },
    {
      id: 'defaultDatepicker',
      key: 'defaultDatepicker',
      type: 'datepicker',
    },
    {
      id: 'defaultDatepickerMandatory',
      key: 'defaultDatepickerMandatory',
      type: 'datepicker',
      props: {
        required: true,
      },
    },
    {
      id: 'withDefaultValue_IsoDay',
      key: 'withDefaultValue_IsoDay',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025-02-13',
    },
    {
      id: 'withDefaultValue_IsoMonth',
      key: 'withDefaultValue_IsoMonth',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025-02',
    },
    {
      id: 'withDefaultValue_Year',
      key: 'withDefaultValue_Year',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
      },
      defaultValue: '2025',
    },
    {
      id: 'withDefaultValue_IsoMonth_defaultPrecision',
      key: 'withDefaultValue_IsoMonth_defaultPrecision',
      type: 'datepicker',
      defaultValue: '2025-02',
    },
    {
      id: 'multiYearDatepicker',
      key: 'multiYearDatepicker',
      type: 'datepicker',
      props: {
        multiYear: true,
        allowedPrecisions: ['day', 'month', 'year'],
      },
    },
    {
      id: 'datepickerWithTimeRange',
      key: 'datepickerWithTimeRange',
      type: 'datepicker',
      props: {
        allowedPrecisions: ['day', 'month', 'year'],
        minDate: new Date('2000-01-01'),
        maxDate: new Date('2009-12-31'),
      },
    },
  ];
}
