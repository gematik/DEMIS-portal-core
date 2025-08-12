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

import { NgClass } from '@angular/common';
import { AfterViewInit, Component, DoCheck, effect, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { format, isValid, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { Subject } from 'rxjs';
import {
  convertNonIsoFormats,
  DatepickerCustomProps,
  DatePrecision,
  DEFAULT_PRECISION_LEVEL,
  detectPrecisionFromDateInGermanFormat,
  determinePrecisionAndFormat,
  precisionToView,
  SupportedDateFormat,
  VALID_FORMATS,
} from './datepicker-shared';
import { DatepickerHeaderComponent } from './header/datepicker-header.component';
import { DatepickerStateService } from './services/datepicker-state.service';

const DYNAMIC_DATE_FNS_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'gem-demis-datepicker',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormlyModule, NgClass],
  providers: [
    DatepickerStateService,
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: de },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: () => ({
        ...DYNAMIC_DATE_FNS_FORMATS,
        display: { ...DYNAMIC_DATE_FNS_FORMATS.display },
        parse: { ...DYNAMIC_DATE_FNS_FORMATS.parse },
      }),
    },
  ],
  templateUrl: './formly-datepicker.component.html',
  styleUrls: ['./formly-datepicker.component.scss'],
})
export class FormlyDatepickerComponent extends FieldType<FieldTypeConfig> implements OnInit, OnDestroy, DoCheck, AfterViewInit {
  label!: string;
  allowedPrecisions!: DatePrecision[];

  private readonly _minDate = signal<Date | null>(null);
  private readonly _maxDate = signal<Date | null>(null);
  readonly minDate = this._minDate.asReadonly();
  readonly maxDate = this._maxDate.asReadonly();
  private prevMinDate: Date | null = null;
  private prevMaxDate: Date | null = null;

  multiYear!: boolean;
  hint!: string;

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  private readonly dateFormats = inject(MAT_DATE_FORMATS);
  private readonly datepickerStateService = inject(DatepickerStateService);
  private readonly destroy$ = new Subject<void>();

  /**
   * Use setCurrentPrecision to set the precision of the datepicker.
   * Can be null when the user enters manually a date and no precision can be detected.
   */
  private currentPrecision!: DatePrecision | null;

  /**
   * Flag to prevent recursive calls to detectAndApplyPrecisionOnProgrammaticValue
   */
  private isProcessingProgrammaticValue = false;

  private get datepickerProps(): DatepickerCustomProps {
    return this.props as DatepickerCustomProps;
  }

  get calendarStartView() {
    const precisionForView = this.currentPrecision;
    return this.multiYear ? 'multi-year' : precisionToView(precisionForView!);
  }

  readonly datepickerHeader = DatepickerHeaderComponent;

  constructor() {
    super();
    this.keepCurrentPrecisionInSync();
  }

  ngOnInit() {
    this.setDefaultValues();
    this.useIsoStringInModel();

    // Needed if the value of the FormControl is set programmatically after the component is initialized.
    // This happens when data are copied from clipboard.
    this.formControl.valueChanges.subscribe(() => {
      this.detectAndApplyPrecisionOnProgrammaticValue();
    });
  }

  ngAfterViewInit() {
    this.detectAndApplyPrecisionOnProgrammaticValue(); //handle initial and default value
  }

  ngDoCheck() {
    this.trackUpdateMinMaxDate();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultValues() {
    this.label = this.datepickerProps.label!;
    this._minDate.set(this.datepickerProps.minDate ?? null);
    this._maxDate.set(this.datepickerProps.maxDate ?? null);
    this.multiYear = this.datepickerProps.multiYear ?? false;

    const requestedPrecisions = this.datepickerProps.allowedPrecisions ?? DEFAULT_PRECISION_LEVEL;
    this.allowedPrecisions = Array.from(VALID_FORMATS.keys()).filter(it => requestedPrecisions.includes(it));
    this.datepickerStateService.initSharedState(this.allowedPrecisions, this.minDate, this.maxDate, this.multiYear);
    this.setCurrentPrecision(this.datepickerStateService.getHighestPrecisionAvailable());

    this.hint = this.allowedPrecisions.map(it => VALID_FORMATS.get(it)!.display).join(' | ');
  }

  private detectAndApplyPrecisionOnProgrammaticValue(): void {
    if (this.isProcessingProgrammaticValue) {
      return; // Prevent recursive calls
    }

    const value = this.formControl.value;

    if (typeof value === 'string') {
      this.isProcessingProgrammaticValue = true;

      try {
        const { precision, format } = determinePrecisionAndFormat(value);

        if (precision) {
          this.processPrecisionValue(value, precision, format);
        } else {
          this.formControl.setErrors({ invalidDate: true });
        }

        this.markAsTouchedIfNotEmpty(value);
      } finally {
        this.isProcessingProgrammaticValue = false;
      }
    }
  }

  private processPrecisionValue(value: string, precision: DatePrecision, format: SupportedDateFormat): void {
    convertNonIsoFormats(this.formControl, value, precision, format);

    if (this.isGermanFormatInvalid(value, precision, format)) {
      this.formControl.setErrors({ invalidDate: true });
      return;
    }

    this.applyPrecisionSettings(precision);
  }

  private isGermanFormatInvalid(value: string, precision: DatePrecision, format: SupportedDateFormat): boolean {
    if (format === 'GERMAN') {
      const parsed = this.inputStringToDate(value, precision);
      return !parsed || !isValid(parsed);
    }
    return false;
  }

  private applyPrecisionSettings(precision: DatePrecision): void {
    this.setCurrentPrecision(precision);
    this.datepickerStateService.setCurrentPrecision(precision);
    this.triggerRendering();

    if (!this.allowedPrecisions.includes(precision)) {
      this.formControl.setErrors({ formatMismatch: true });
    }
  }

  private markAsTouchedIfNotEmpty(value: string): void {
    if (value?.trim?.()) {
      this.formControl.markAsTouched();
    }
  }

  /**
   * Ensures the model stores the date as an ISO string with the appropriate precision.
   * The format can be YYYY, YYYY-MM, or YYYY-MM-DD depending on the selected precision.
   *
   * This is handled using a Formly parser that transforms the Date object into
   * a string before updating the model.
   *
   * @private
   */
  private useIsoStringInModel() {
    this.field.parsers = [
      (value: unknown) => {
        if (typeof value === 'string') {
          value = value?.trim?.();
        }
        if (this.currentPrecision && value instanceof Date && isValid(value)) {
          return this.dateToIsoString(value);
        }
        return value;
      },
    ];
  }

  /**
   * The user can change the precision in the datepicker header.
   * This method listens for changes and updates the calendar view accordingly.
   */
  private keepCurrentPrecisionInSync() {
    effect(() => {
      const precisionSignal = this.datepickerStateService.getCurrentPrecision();
      this.setCurrentPrecision(precisionSignal());
    });
  }

  /**
   * The min and max dates are configured via Formly. These can be static values or dynamic expressions.
   * For example, the min date may depend on the value of another form field. In such cases, if that field changes,
   * the datepicker's min (or max) value must also be updated accordingly. That's why we track changes to the min and max dates here.
   */
  private trackUpdateMinMaxDate() {
    if (this.datepickerProps.minDate !== this.prevMinDate) {
      this.onMinDateChanged(this.datepickerProps.minDate ?? null);
    }
    if (this.datepickerProps.maxDate !== this.prevMaxDate) {
      this.onMaxDateChanged(this.datepickerProps.maxDate ?? null);
    }
  }

  onMinDateChanged(newMin: Date | null) {
    this.prevMinDate = newMin;
    this._minDate.set(newMin);
  }

  onMaxDateChanged(newMax: Date | null) {
    this.prevMaxDate = newMax;
    this._maxDate.set(newMax);
  }

  onRawInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value?.trim?.();
    const normalizedInput = this.normalizeInput(input);
    // Update the visible value
    inputElement.value = normalizedInput;

    if (!normalizedInput) {
      this.formControl.reset();
      return;
    }

    this.setCurrentPrecision(detectPrecisionFromDateInGermanFormat(normalizedInput));
    if (this.currentPrecision) {
      this.datepickerStateService.setCurrentPrecision(this.currentPrecision);
    }

    if (this.currentPrecision && this.allowedPrecisions.includes(this.currentPrecision)) {
      const parsed = this.inputStringToDate(normalizedInput, this.currentPrecision);
      if (parsed && isValid(parsed)) {
        this.formControl.setValue(parsed);
      } else {
        this.formControl.setErrors({ invalidDate: true });
      }
    } else {
      this.formControl.setErrors({ formatMismatch: true });
    }
  }

  private normalizeInput(input: string): string {
    // Allow only digits and dots
    const cleaned = input.replace(/[^0-9.]/g, '');

    const digitsOnly = cleaned.replace(/\D/g, '');
    const dotCount = (cleaned.match(/\./g) || []).length;

    // Auto-format to MM.YYYY if exactly 6 digits
    if (digitsOnly.length === 6 && dotCount !== 2) {
      return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2)}`;
    }
    // Auto-format to TT.MM.YYYY if exactly 8 digits
    if (digitsOnly.length === 8) {
      return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 4)}.${digitsOnly.slice(4)}`;
    }
    return cleaned;
  }

  onMonthSelected(date: Date) {
    if (this.currentPrecision === 'month') {
      this.formControl.setValue(date);
      this.picker.close();
    }
  }

  onYearSelected(date: Date) {
    if (this.currentPrecision === 'year') {
      this.formControl.setValue(date);
      this.picker.close();
    }
  }

  onDatepickerToggleClick() {
    const defaultPrecision = this.datepickerStateService.getHighestPrecisionAvailable();
    this.setCurrentPrecision(defaultPrecision);
    this.datepickerStateService.setCurrentPrecision(defaultPrecision);
  }

  private setCurrentPrecision(precision: DatePrecision | null): void {
    this.currentPrecision = precision;
    if (precision && VALID_FORMATS.has(precision)) {
      this.dateFormats.display.dateInput = VALID_FORMATS.get(precision)!.input;
    } else {
      this.dateFormats.display.dateInput = null;
    }
  }

  private dateToIsoString(date: Date): string {
    return format(date, VALID_FORMATS.get(this.currentPrecision!)!.model);
  }

  private inputStringToDate(input: string, precision: DatePrecision): Date | null {
    if (precision !== null) {
      return parse(input, VALID_FORMATS.get(precision)!.input, new Date());
    }
    return null;
  }

  get customErrorMessage(): string | null {
    const errors = this.formControl.errors;
    const rawValue = this.formControl.value;

    if (!errors) return null;

    const isVisibleInInput = rawValue instanceof Date;
    const messagesFromFormlyConfig = this.field.validation?.messages;
    const showRaw = !isVisibleInInput && typeof rawValue === 'string';
    const rawSuffix = showRaw ? ` "${rawValue}"` : '';

    if (errors['formatMismatch']) {
      return `Es sind nur folgende Formate erlaubt: ${this.hint}`;
    }

    if (errors['invalidDate']) {
      return `Das eingegebene Datum${rawSuffix} ist ungültig`;
    }

    if (errors['matDatepickerMin']) {
      if (typeof messagesFromFormlyConfig?.['minDate'] === 'string') {
        return messagesFromFormlyConfig?.['minDate'];
      } else {
        return `Das Datum darf nicht vor dem ${format(errors['matDatepickerMin'].min, 'dd.MM.yyyy')} liegen`;
      }
    }

    if (errors['matDatepickerMax']) {
      if (typeof messagesFromFormlyConfig?.['maxDate'] === 'string') {
        return messagesFromFormlyConfig?.['maxDate'];
      } else {
        return `Das Datum darf nicht nach dem ${format(errors['matDatepickerMax'].max, 'dd.MM.yyyy')} liegen`;
      }
    }
    return null;
  }

  private triggerRendering() {
    const current = this.formControl.value;
    this.formControl.setValue(current, { emitEvent: false });
  }
}
