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
import { MockBuilder, MockRender } from 'ng-mocks';
import { FollowUpNotificationIdDialogComponent } from './follow-up-notification-id-dialog.component';
import { FollowUpNotificationIdService, ValidationStatus } from '../../services/follow-up-notification-id.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

describe('FollowUpNotificationIdDialogComponent', () => {
  let component: FollowUpNotificationIdDialogComponent;
  let service: FollowUpNotificationIdService;
  let router: Router;
  let fixture: ReturnType<typeof MockRender<FollowUpNotificationIdDialogComponent>>;

  const validationStatusMock: WritableSignal<ValidationStatus> = signal<ValidationStatus>(ValidationStatus.NOT_VALIDATED);

  const mockDialogData = {
    routerLink: '/otherNotificationType',
    linkTextContent: 'other NotificationType',
    pathToDestinationLookup: 'path/lookup',
  };

  beforeEach(async () => {
    await MockBuilder(FollowUpNotificationIdDialogComponent)
      .keep(MatFormField)
      .keep(MatInput)
      .mock(FollowUpNotificationIdService, {
        validationStatus: validationStatusMock,
        validateNotificationId: (_id: string, _path: string) => {},
        closeDialog: () => {},
        hasValidNotificationId: signal<boolean | undefined>(false),
        hasValidNotificationId$: of(false),
      } as Partial<FollowUpNotificationIdService> as FollowUpNotificationIdService)
      .mock(Router, {
        navigate: (_commands: any[]) => Promise.resolve(true),
      } as Partial<Router> as Router)
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: mockDialogData,
      })
      .provide({
        provide: LiveAnnouncer,
        useValue: {
          announce: (_message: string, _politeness?: any) => Promise.resolve(),
          clear: () => {},
        } satisfies Partial<LiveAnnouncer>,
      });

    // Reset the mock to the initial state before each test
    validationStatusMock.set(ValidationStatus.NOT_VALIDATED);

    fixture = MockRender(FollowUpNotificationIdDialogComponent);
    component = fixture.point.componentInstance;

    service = fixture.point.injector.get(FollowUpNotificationIdService);
    router = fixture.point.injector.get(Router);
  });

  describe('Initial state', () => {
    it('has a required FormControl and starts with ValidationStatus NOT_VALIDATED', () => {
      expect(component.initialNotificationIdControl).toBeDefined();
      expect(component.initialNotificationIdControl.hasValidator).toBeDefined();
      expect(component.validationStatus()).toBe(ValidationStatus.NOT_VALIDATED);

      const cls = component.getInputClass();
      expect(cls).toContain('initial-notification-id-input-field-');
      expect(cls.endsWith('notvalidated')).toBe(true);
    });

    it('isTextInputValid() is initially false', () => {
      expect(component.isTextInputValid()).toBe(false);
    });
  });

  describe('Error handling via effect() based on validationStatus', () => {
    it('sets error "invalid" if status is NOT_FOUND', () => {
      validationStatusMock.set(ValidationStatus.NOT_FOUND);
      fixture.detectChanges(); // Let effect run

      expect(component.initialNotificationIdControl.errors).toEqual(expect.objectContaining({ invalid: true }));
      expect(component.getValidationStyle()).toBe('invalid');
      expect(component.getInputClass()).toBe('initial-notification-id-input-field-invalid');
    });

    it('sets no errors if status is VALID', () => {
      validationStatusMock.set(ValidationStatus.VALID);
      fixture.detectChanges();

      expect(component.initialNotificationIdControl.errors).toBeNull();
      expect(component.getValidationStyle()).toBe('valid');
      expect(component.getInputClass()).toBe('initial-notification-id-input-field-valid');
    });

    it('sets "notvalidated" if status is NOT_VALIDATED or no errors', () => {
      validationStatusMock.set(ValidationStatus.NOT_VALIDATED);
      fixture.detectChanges();

      expect(component.getValidationStyle()).toBe('notvalidated');

      component.initialNotificationIdControl.setValue('abc'); // fulfills required
      fixture.detectChanges();

      expect(component.initialNotificationIdControl.errors).toBeNull();
      expect(component.getValidationStyle()).toBe('notvalidated');
    });
  });
  describe('validateNotificationId()', () => {
    it('calls the service only if ID is present', () => {
      const spy = vi.spyOn(service, 'validateNotificationId');

      component.validateNotificationId(null);
      expect(spy).not.toHaveBeenCalled();

      component.validateNotificationId('');
      expect(spy).not.toHaveBeenCalled();

      component.validateNotificationId('invp');
      expect(spy).toHaveBeenCalledWith('invp', mockDialogData.pathToDestinationLookup);
    });

    it('uses pathToDestinationLookup from MAT_DIALOG_DATA', () => {
      const spy = vi.spyOn(service, 'validateNotificationId');

      component.validateNotificationId('id-999');
      expect(spy).toHaveBeenCalledTimes(1);
      const args = vi.mocked(spy).mock.lastCall as any;
      expect(args).toHaveLength(2);
      expect(args[0]).toBe('id-999');
      expect(args[1]).toBe(mockDialogData.pathToDestinationLookup);
    });
  });

  describe('isTextInputValid()', () => {
    it('is true if control is valid and touched', () => {
      component.initialNotificationIdControl.setValue('valid');
      component.initialNotificationIdControl.markAsTouched();

      expect(component.initialNotificationIdControl.valid).toBe(true);
      expect(component.isTextInputValid()).toBe(true);
    });

    it('is true if control is valid and dirty', () => {
      component.initialNotificationIdControl.setValue('valid');
      component.initialNotificationIdControl.markAsDirty();

      expect(component.initialNotificationIdControl.valid).toBe(true);
      expect(component.isTextInputValid()).toBe(true);
    });

    it('is false if control is invalid or neither touched nor dirty', () => {
      component.initialNotificationIdControl.setValue('');
      component.initialNotificationIdControl.markAsUntouched();
      component.initialNotificationIdControl.markAsPristine();

      expect(component.initialNotificationIdControl.valid).toBe(false);
      expect(component.isTextInputValid()).toBe(false);

      component.initialNotificationIdControl.setValue('ok');
      expect(component.initialNotificationIdControl.valid).toBe(true);
      expect(component.isTextInputValid()).toBe(false); // neither touched nor dirty
    });
  });

  describe('closeDialog()', () => {
    it('delegates to FollowUpNotificationIdService', async () => {
      const spy = vi.spyOn(service, 'closeDialog');
      await component.closeDialog();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('navigateToWelcomePage()', () => {
    it('closes dialog and navigates twice: "" and then "/welcome"', async () => {
      const closeSpy = vi.spyOn(service, 'closeDialog');
      const navSpy = vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

      await component.navigateToWelcomePage();

      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(vi.mocked(navSpy).mock.calls.length).toBe(2);
      expect(vi.mocked(navSpy).mock.calls[0][0]).toEqual(['']);
      expect(vi.mocked(navSpy).mock.calls[1][0]).toEqual(['/welcome']);
    });
  });

  describe('Accessibility announcements', () => {
    it('announces success once when validation status transitions to VALID', () => {
      const liveAnnouncer = fixture.point.injector.get(LiveAnnouncer);
      const announceSpy = vi.spyOn(liveAnnouncer, 'announce');

      // Transition to VALID triggers announcement.
      validationStatusMock.set(ValidationStatus.VALID);
      fixture.detectChanges();

      expect(announceSpy).toHaveBeenCalledTimes(1);
      expect((vi.mocked(announceSpy).mock.lastCall as any)[0]).toContain('Meldungs-ID');

      // Further detectChanges should not announce again.
      fixture.detectChanges();
      expect(announceSpy).toHaveBeenCalledTimes(1);

      // Setting VALID again should not spam announcements.
      validationStatusMock.set(ValidationStatus.VALID);
      fixture.detectChanges();
      expect(announceSpy).toHaveBeenCalledTimes(1);

      // Transition away and back should announce again.
      validationStatusMock.set(ValidationStatus.NOT_FOUND);
      fixture.detectChanges();
      validationStatusMock.set(ValidationStatus.VALID);
      fixture.detectChanges();
      expect(announceSpy).toHaveBeenCalledTimes(2);
    });

    it('moves focus to the "Weiter" button once validation becomes VALID', async () => {
      validationStatusMock.set(ValidationStatus.VALID);
      fixture.detectChanges();

      // afterNextRender() + setTimeout(fn, 100) schedule work; wait until focus is applied.
      await vi.waitFor(
        () => {
          const nextBtn = document.getElementById('btn-next') as HTMLButtonElement | null;
          expect(nextBtn, 'Expected "Weiter" button to exist in VALID state').not.toBeNull();
          expect(document.activeElement).toBe(nextBtn);
        },
        { timeout: 500 }
      );

      // Extra change detection should not steal focus.
      fixture.detectChanges();
      const nextBtn = document.getElementById('btn-next') as HTMLButtonElement | null;
      expect(document.activeElement).toBe(nextBtn);
    });
  });
});
