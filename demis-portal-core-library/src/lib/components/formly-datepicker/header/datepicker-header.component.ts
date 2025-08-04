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

import { Component, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCalendar, MatCalendarView } from '@angular/material/datepicker';
import { startWith, Subject, takeUntil } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatepickerStateService } from '../services/datepicker-state.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { DatePrecision, NavigationDirection, precisionToView, VALID_FORMATS, YEARS_PER_PAGE } from '../datepicker-shared';
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';

@Component({
  selector: 'gem-demis-datepicker-header',
  imports: [MatIcon, MatIconButton, AsyncPipe, MatButton, NgIf],
  templateUrl: './datepicker-header.component.html',
  styleUrl: './datepicker-header.component.scss',
})
export class DatepickerHeaderComponent implements OnInit, OnDestroy {
  allowedPrecisions!: DatePrecision[];
  currentPrecision!: DatePrecision;
  private multiYear!: boolean;
  private minDate!: Signal<Date | null>;
  private maxDate!: Signal<Date | null>;

  private readonly calendar = inject<MatCalendar<Date>>(MatCalendar);
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly dateFormats = inject(MAT_DATE_FORMATS);
  private readonly datepickerStateService = inject(DatepickerStateService);

  private readonly destroy$ = new Subject<void>();

  periodLabel = signal('');

  public readonly precisionEntries = Array.from(VALID_FORMATS.entries()).map(([key, value]) => ({
    key,
    display: value.display,
  }));

  get activeCalendarView(): MatCalendarView {
    return this.calendar.currentView;
  }

  ngOnInit(): void {
    this.allowedPrecisions = this.datepickerStateService.getAllowedPrecisions();
    this.currentPrecision = this.datepickerStateService.getCurrentPrecision()();

    this.calendar.stateChanges.pipe(startWith(null), takeUntil(this.destroy$)).subscribe(() => {
      this.periodLabel.set(this.dateAdapter.format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel).toLocaleUpperCase());
    });

    this.minDate = this.datepickerStateService.getMinDate();
    this.maxDate = this.datepickerStateService.getMaxDate();
    this.multiYear = this.datepickerStateService.isMultiYear();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  previousClicked(mode: MatCalendarView): void {
    this.changeDate(mode, NavigationDirection.PAST);
  }

  nextClicked(mode: MatCalendarView): void {
    this.changeDate(mode, NavigationDirection.FUTURE);
  }

  private changeDate(mode: MatCalendarView, direction: NavigationDirection): void {
    const date = this.calendar.activeDate;

    switch (mode) {
      case 'month':
        this.calendar.activeDate = this.dateAdapter.addCalendarMonths(date, direction);
        break;
      case 'year':
        this.calendar.activeDate = this.dateAdapter.addCalendarYears(date, direction);
        break;
      case 'multi-year':
        this.calendar.activeDate = this.dateAdapter.addCalendarYears(date, direction * 24);
        break;
    }
  }

  setViewFor(precision: DatePrecision) {
    if (precision !== this.currentPrecision) {
      this.currentPrecision = precision;
      this.datepickerStateService.setCurrentPrecision(precision);
      this.calendar.currentView = this.multiYear ? 'multi-year' : precisionToView(precision);
    }
  }

  canGoPrevious(mode: MatCalendarView): boolean {
    return this.canNavigate(mode, NavigationDirection.PAST);
  }

  canGoNext(mode: MatCalendarView): boolean {
    return this.canNavigate(mode, NavigationDirection.FUTURE);
  }

  private canNavigate(mode: MatCalendarView, direction: NavigationDirection): boolean {
    const dateLimit = direction === NavigationDirection.PAST ? this.minDate() : this.maxDate();
    const activeDate = this.calendar.activeDate;

    if (!dateLimit) return true;

    switch (mode) {
      case 'month':
        return direction === NavigationDirection.PAST
          ? this.dateAdapter.compareDate(startOfMonth(activeDate), dateLimit) > 0
          : this.dateAdapter.compareDate(endOfMonth(activeDate), dateLimit) < 0;

      case 'year':
        return direction === NavigationDirection.PAST
          ? this.dateAdapter.compareDate(startOfYear(activeDate), dateLimit) > 0
          : this.dateAdapter.compareDate(endOfYear(activeDate), dateLimit) < 0;

      case 'multi-year':
        return !this.isSameMultiYearView(this.calendar.activeDate, dateLimit);
    }
  }

  /**
   * This is the logic applied by Angular Material's standard Datepicker header to check if two dates are in the same multi-year view.
   * We had to integrate it to our code because we have our custom header and Angular Material doesn't expose any public method for this.
   * @param date1
   * @param date2
   * @private
   */
  private isSameMultiYearView(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    const startingYear = this.getStartingYear(this.minDate(), this.maxDate());
    return Math.floor((year1 - startingYear) / YEARS_PER_PAGE) === Math.floor((year2 - startingYear) / YEARS_PER_PAGE);
  }

  /**
   * Angular Material's Datepicker picks a "starting" year such that either the maximum year would be at the end
   * or the minimum year would be at the beginning of a page.
   */
  private getStartingYear(minDate: Date | null, maxDate: Date | null): number {
    let startingYear = 0;
    if (maxDate) {
      const maxYear = maxDate.getFullYear();
      startingYear = maxYear - YEARS_PER_PAGE + 1;
    } else if (minDate) {
      startingYear = minDate.getFullYear();
    }
    return startingYear;
  }
}
