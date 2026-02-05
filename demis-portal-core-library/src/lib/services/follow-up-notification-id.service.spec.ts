// follow-up-notification-id.service.spec.ts

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
import { of, Subject, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FollowUpNotificationIdService, ValidationStatus } from './follow-up-notification-id.service';
import { FhirCoreNotificationService, FollowUpNotificationCategory } from './fhir-core-notification.service';
import { FollowUpNotificationIdDialogComponent } from '../components/follow-up-notification-id-dialog/follow-up-notification-id-dialog.component';
import { TestBed } from '@angular/core/testing';

class MatDialogRefMock<T> {
  private readonly closed$ = new Subject<void>();

  afterClosed() {
    return this.closed$.asObservable();
  }

  close(): void {
    this.closed$.next();
    this.closed$.complete();
  }
}

describe('FollowUpNotificationIdService', () => {
  let service: FollowUpNotificationIdService;
  let dialog: MatDialog;
  let fhirService: FhirCoreNotificationService;

  let dialogRefMock: MatDialogRefMock<FollowUpNotificationIdDialogComponent>;

  beforeEach(async () => {
    await MockBuilder(FollowUpNotificationIdService)
      .mock(MatDialog, {
        open: () => ({}) as MatDialogRef<any>,
        openDialogs: [],
      } as Partial<MatDialog> as MatDialog)
      .mock(FhirCoreNotificationService, {
        fetchFollowUpNotificationCategory: () => of({ notificationCategory: 'invp' }),
      } as Partial<FhirCoreNotificationService> as FhirCoreNotificationService)
      .mock(FollowUpNotificationIdDialogComponent);

    // Important: For services use TestBed.inject, not MockRender(...)
    service = TestBed.inject(FollowUpNotificationIdService);
    dialog = TestBed.inject(MatDialog);
    fhirService = TestBed.inject(FhirCoreNotificationService);

    dialogRefMock = new MatDialogRefMock<FollowUpNotificationIdDialogComponent>();
    spyOn(dialog, 'open').and.returnValue(dialogRefMock as unknown as MatDialogRef<FollowUpNotificationIdDialogComponent>);
    (dialog.openDialogs as any[]).length = 0;
  });

  describe('openDialog()', () => {
    const dialogData = {
      dialogData: {
        routerLink: '/abc-notification/xyz',
        linkTextContent: 'eines namentlichen abc Nachweises nach xyz',
        pathToDestinationLookup: '/destination-lookup',
        errorUnsupportedNotificationCategory: 'Fehler! abc Folgemeldungen werden nicht unterstützt.',
      },
      notificationCategoryCodes: ['invp', 'abvp'],
    };

    it('opens the dialog only if none is open and passes data', () => {
      expect(dialog.openDialogs.length).toBe(0);

      service.openDialog(dialogData);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      const args = (dialog.open as jasmine.Spy).calls.mostRecent().args;
      const component = args[0];
      const config = args[1];

      expect(component).toBe(FollowUpNotificationIdDialogComponent);
      expect(config.disableClose).toBeTrue();
      expect(config.data).toEqual(
        jasmine.objectContaining({
          routerLink: dialogData.dialogData.routerLink,
          linkTextContent: dialogData.dialogData.linkTextContent,
          pathToDestinationLookup: dialogData.dialogData.pathToDestinationLookup,
          errorUnsupportedNotificationCategory: dialogData.dialogData.errorUnsupportedNotificationCategory,
        })
      );

      // simulate open dialog
      (dialog.openDialogs as any[]).push({} as any);
    });

    it('does not open another dialog if one is already open', () => {
      (dialog.openDialogs as any[]).push({} as any);

      service.openDialog(dialogData);

      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('sets hasValidNotificationId to true after close if VALID + ID present', () => {
      service.openDialog(dialogData);

      expect(service.hasValidNotificationId()).toBeFalse();

      // Simulate successful state
      service.validationStatus.set(ValidationStatus.VALID);
      service.validatedNotificationId.set('id-123');

      dialogRefMock.close();

      expect(service.hasValidNotificationId()).toBeTrue();
    });

    it('remains false after close if not VALID or no ID', () => {
      service.openDialog(dialogData);

      service.validationStatus.set(ValidationStatus.NOT_FOUND);
      service.validatedNotificationId.set(undefined);

      dialogRefMock.close();

      expect(service.hasValidNotificationId()).toBeFalse();
    });
  });

  describe('closeDialog()', () => {
    it('closes the dialog if present', () => {
      service.openDialog({
        dialogData: {
          routerLink: '/abc-notification/xyz',
          linkTextContent: 'eines namentlichen abc Nachweises nach xyz',
          pathToDestinationLookup: '/destination-lookup',
          errorUnsupportedNotificationCategory: 'Fehler! abc Folgemeldungen werden nicht unterstützt.',
        },
      });
      const closeSpy = spyOn(dialogRefMock, 'close').and.callThrough();

      service.closeDialog();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('does nothing if no DialogRef exists', () => {
      // not opened
      expect(() => service.closeDialog()).not.toThrow();
    });
  });

  describe('validateNotificationId()', () => {
    const id = 'id-456';
    const path = 'path/lookup';

    it('first sets status to NOT_VALIDATED, then to VALID on success and fills signals', () => {
      const response: FollowUpNotificationCategory = { notificationCategory: 'invp' };
      spyOn(fhirService, 'fetchFollowUpNotificationCategory').and.returnValue(of(response));

      // Previous state
      service.validationStatus.set(ValidationStatus.NOT_FOUND);
      service.validatedNotificationId.set(undefined);
      service.followUpNotificationCategory.set(undefined);

      service.validateNotificationId(id, path);

      expect(fhirService.fetchFollowUpNotificationCategory).toHaveBeenCalledWith(id, path);

      expect(service.validationStatus()).toBe(ValidationStatus.VALID);
      expect(service.validatedNotificationId()).toBe(id);
      expect(service.followUpNotificationCategory()).toBe('invp');
    });

    it('sets NOT_FOUND and clears signals on error', () => {
      spyOn(fhirService, 'fetchFollowUpNotificationCategory').and.returnValue(throwError(() => new Error('404')));

      service.validatedNotificationId.set('old');
      service.followUpNotificationCategory.set('oldCat');

      service.validateNotificationId(id, path);

      expect(service.validationStatus()).toBe(ValidationStatus.NOT_FOUND);
      expect(service.validatedNotificationId()).toBeUndefined();
      expect(service.followUpNotificationCategory()).toBeUndefined();
    });

    it('accepts supported category if codes are set', () => {
      const response: FollowUpNotificationCategory = { notificationCategory: 'abvp' };
      spyOn(fhirService, 'fetchFollowUpNotificationCategory').and.returnValue(of(response));

      // via openDialog we set the codes (normal flow)
      service.openDialog({
        dialogData: {
          routerLink: '/abc-notification/xyz',
          linkTextContent: 'eines namentlichen abc Nachweises nach xyz',
          pathToDestinationLookup: '/destination-lookup',
          errorUnsupportedNotificationCategory: 'Fehler! abc Folgemeldungen werden nicht unterstützt.',
        },
      });
      service.validateNotificationId(id, path);

      expect(service.validationStatus()).toBe(ValidationStatus.VALID);
      expect(service.validatedNotificationId()).toBe(id);
      expect(service.followUpNotificationCategory()).toBe('abvp');
    });

    it('unsupported category sets validationStatus UNSUPPORTED_NOTIFICATION_CATEGORY', () => {
      const response: FollowUpNotificationCategory = { notificationCategory: 'invd' };
      spyOn(fhirService, 'fetchFollowUpNotificationCategory').and.returnValue(of(response));

      service.openDialog({
        dialogData: {
          routerLink: '/abc-notification/xyz',
          linkTextContent: 'eines namentlichen abc Nachweises nach xyz',
          pathToDestinationLookup: '/destination-lookup',
          errorUnsupportedNotificationCategory: 'Fehler! abc Folgemeldungen werden nicht unterstützt.',
        },
        notificationCategoryCodes: ['invp', 'abvp'],
      });
      // Set a different state before to check for change
      service.validationStatus.set(ValidationStatus.VALID);
      service.validatedNotificationId.set('prev');
      service.followUpNotificationCategory.set('prevCat');

      service.validateNotificationId(id, path);

      expect(service.validationStatus()).toBe(ValidationStatus.UNSUPPORTED_NOTIFICATION_CATEGORY);
      expect(service.validatedNotificationId()).toBeUndefined();
      expect(service.followUpNotificationCategory()).toBeUndefined();
    });

    it('accepts any category if no codes are set', () => {
      const response: FollowUpNotificationCategory = { notificationCategory: 'abcd' };
      spyOn(fhirService, 'fetchFollowUpNotificationCategory').and.returnValue(of(response));

      // do not set codes (no openDialog with codes)
      service.validateNotificationId(id, path);

      expect(service.validationStatus()).toBe(ValidationStatus.VALID);
      expect(service.validatedNotificationId()).toBe(id);
      expect(service.followUpNotificationCategory()).toBe('abcd');
    });
  });

  describe('resetState()', () => {
    it('resets validatedNotificationId and validationStatus', () => {
      service.validatedNotificationId.set('id-1');
      service.validationStatus.set(ValidationStatus.VALID);

      service.resetState();

      expect(service.validatedNotificationId()).toBeUndefined();
      expect(service.validationStatus()).toBe(ValidationStatus.NOT_VALIDATED);
    });
  });
});
