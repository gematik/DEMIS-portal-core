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

import { MockBuilder } from 'ng-mocks';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FollowUpMixedCodesService } from './follow-up-mixed-codes.service';
import { FollowUpMixedCodesDialogComponent } from '../components/follow-up-mixed-codes-dialog/follow-up-mixed-codes-dialog.component';
import { TestBed } from '@angular/core/testing';
import { customCodeDisplay } from '../formly/commons';

class MatDialogRefMock<T> {
  private readonly closed$ = new Subject<string | undefined>();

  close(result?: string | undefined): void {
    this.closed$.next(result);
    this.closed$.complete();
  }

  afterClosed() {
    return this.closed$.asObservable();
  }
}

describe('FollowUpMixedCodesService', () => {
  let service: FollowUpMixedCodesService;
  let dialog: MatDialog;
  let dialogRefMock: MatDialogRefMock<FollowUpMixedCodesDialogComponent>;

  const mockMixedCodesList: customCodeDisplay[] = [
    {
      code: 'code1',
      display: 'display1',
    },
    {
      code: 'code2',
      display: 'display2',
    },
  ];

  beforeEach(async () => {
    await MockBuilder(FollowUpMixedCodesService)
      .mock(MatDialog, {
        open: () => ({}) as MatDialogRef<any>,
        openDialogs: [],
      } as Partial<MatDialog> as MatDialog)
      .mock(FollowUpMixedCodesDialogComponent);

    service = TestBed.inject(FollowUpMixedCodesService);
    dialog = TestBed.inject(MatDialog);

    dialogRefMock = new MatDialogRefMock<FollowUpMixedCodesDialogComponent>();
    spyOn(dialog, 'open').and.returnValue(dialogRefMock as unknown as MatDialogRef<FollowUpMixedCodesDialogComponent>);
    (dialog.openDialogs as any[]).length = 0;
  });

  describe('openDialog()', () => {
    it('opens the dialog when none is open', () => {
      service.openDialog(mockMixedCodesList);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      const args = (dialog.open as jasmine.Spy).calls.mostRecent().args;
      const component = args[0];
      const config = args[1];

      expect(component).toBe(FollowUpMixedCodesDialogComponent);
      expect(config.disableClose).toBeTrue();
      expect(config.ariaModal).toBeTrue();
      expect(config.ariaLabelledBy).toBe('dialog-title');
      expect(config.ariaDescribedBy).toBe('dialog-paragraph');
      expect(config.data).toEqual(mockMixedCodesList);
    });

    it('does not open another dialog if one is already open', () => {
      service.openDialog(mockMixedCodesList);

      service.openDialog(mockMixedCodesList);

      expect(dialog.open).toHaveBeenCalledTimes(1);
    });

    it('returns the result from afterClosed() after opening dialog', done => {
      service.openDialog(mockMixedCodesList).subscribe(result => {
        expect(result).toBe('code1');
        done();
      });

      dialogRefMock.close('code1');
    });

    it('returns undefined if dialog is closed without result', done => {
      service.openDialog(mockMixedCodesList).subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });

      dialogRefMock.close(undefined);
    });

    it('clears dialogRef after dialog is closed', () => {
      service.openDialog(mockMixedCodesList);

      // Verify dialog is open
      expect((service as any).dialogRef).not.toBeNull();

      dialogRefMock.close('code1');

      // Verify dialog is cleared
      expect((service as any).dialogRef).toBeNull();
    });

    it('returns previousDialog afterClosed if one is already open', done => {
      // First dialog
      const first$ = service.openDialog(mockMixedCodesList);

      // Try to open another - should return first dialog's afterClosed
      const second$ = service.openDialog(mockMixedCodesList);

      expect(dialog.open).toHaveBeenCalledTimes(1);

      second$.subscribe(result => {
        expect(result).toBe('code2');
        done();
      });

      dialogRefMock.close('code2');
    });
  });

  describe('closeDialog()', () => {
    it('closes the dialog if present', () => {
      service.openDialog(mockMixedCodesList);
      const closeSpy = spyOn(dialogRefMock, 'close').and.callThrough();

      service.closeDialog('code1');

      expect(closeSpy).toHaveBeenCalledWith('code1');
    });

    it('closes the dialog with undefined result if no result provided', () => {
      service.openDialog(mockMixedCodesList);
      const closeSpy = spyOn(dialogRefMock, 'close').and.callThrough();

      service.closeDialog();

      expect(closeSpy).toHaveBeenCalledWith(undefined);
    });

    it('does nothing if no DialogRef exists', () => {
      // not opened
      expect(() => service.closeDialog()).not.toThrow();
    });

    it('closes the dialog with the correct selected value', () => {
      service.openDialog(mockMixedCodesList);
      const closeSpy = spyOn(dialogRefMock, 'close').and.callThrough();

      service.closeDialog('code2');

      expect(closeSpy).toHaveBeenCalledWith('code2');
    });
  });

  describe('selectedValue signal', () => {
    it('is initially undefined', () => {
      expect(service.selectedValue()).toBeUndefined();
    });

    it('can be updated', () => {
      service.selectedValue.set('code1');
      expect(service.selectedValue()).toBe('code1');
    });
  });

  describe('openDialog + closeDialog', () => {
    it('opens dialog, updates selectedValue, and closes with result', done => {
      const result$ = service.openDialog(mockMixedCodesList);

      result$.subscribe(result => {
        expect(result).toBe('code2');
        expect(service.selectedValue()).toBe('code2');
        done();
      });

      // Simulate user selecting a code
      service.selectedValue.set('code2');

      // Simulate user clicking close button
      service.closeDialog(service.selectedValue());
    });

    it('returns existing dialogRef afterClosed if one is already open', done => {
      // First dialog
      const result1$ = service.openDialog(mockMixedCodesList);

      let result1Received = false;

      result1$.subscribe(() => {
        result1Received = true;
      });

      // Try second dialog - should return the same dialogRef
      const result2$ = service.openDialog(mockMixedCodesList);

      result2$.subscribe(result => {
        expect(result).toBe('code2');
        // Both subscriptions should receive the same result
        expect(result1Received).toBeTrue();
        done();
      });

      // Close the dialog - both subscriptions should complete
      dialogRefMock.close('code2');
    });
  });
});
