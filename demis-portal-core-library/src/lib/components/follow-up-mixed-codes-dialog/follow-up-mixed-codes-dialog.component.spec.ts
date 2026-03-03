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

import { FollowUpMixedCodesDialogComponent } from './follow-up-mixed-codes-dialog.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FollowUpMixedCodesService } from '../../services/follow-up-mixed-codes.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormField } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

describe('FollowUpMixedCodesDialogComponent', () => {
  let component: FollowUpMixedCodesDialogComponent;
  let fixture: ReturnType<typeof MockRender<FollowUpMixedCodesDialogComponent>>;
  let service: FollowUpMixedCodesService;
  let router: Router;

  const notificationCategoriesMock = [
    {
      code: 'code1',
      display: 'display1',
    },
    { code: 'code2', display: 'display2' },
  ];

  beforeEach(async () => {
    await MockBuilder(FollowUpMixedCodesDialogComponent)
      .keep(MatFormField)
      .keep(MatRadioGroup)
      .keep(MatRadioButton)
      .mock(FollowUpMixedCodesService, {
        closeDialog: jasmine.createSpy('closeDialog'),
      } as Partial<FollowUpMixedCodesService> as FollowUpMixedCodesService)
      .mock(Router, {
        navigate: (_commands: any[]) => Promise.resolve(true),
      } as Partial<Router> as Router)
      .mock(LiveAnnouncer, {
        announce: (_message: string, _politeness?: any) => Promise.resolve(),
        clear: () => {},
      } as Partial<LiveAnnouncer>)
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: notificationCategoriesMock,
      });

    fixture = MockRender(FollowUpMixedCodesDialogComponent);
    component = fixture.point.componentInstance;
    service = fixture.point.injector.get(FollowUpMixedCodesService);
    router = fixture.point.injector.get(Router);
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should receive notificationCategories from MAT_DIALOG_DATA', () => {
      expect(component.notificationCategories).toEqual(notificationCategoriesMock);
      expect(component.notificationCategories.length).toBe(2);
      expect(component.notificationCategories[0].code).toBe('code1');
      expect(component.notificationCategories[1].display).toBe('display2');
    });

    it('should initialize selectedValue as undefined or null', () => {
      const value = component.selectedValue();
      expect(value === undefined || value === null).toBeTrue();
    });

    it('should initialize nextButtonDisabled as true when no selection', () => {
      expect(component.nextButtonDisabled()).toBeTrue();
    });
  });

  describe('selectedValue signal', () => {
    it('can be updated with a code selection', () => {
      component.selectedValue.set('code1');
      expect(component.selectedValue()).toBe('code1');
    });

    it('updates nextButtonDisabled when selectedValue changes', () => {
      expect(component.nextButtonDisabled()).toBeTrue();

      component.selectedValue.set('code1');
      expect(component.nextButtonDisabled()).toBeFalse();

      component.selectedValue.set('code2');
      expect(component.nextButtonDisabled()).toBeFalse();

      component.selectedValue.set(undefined);
      expect(component.nextButtonDisabled()).toBeTrue();
    });

    it('disables next button when value is set to undefined', () => {
      component.selectedValue.set('code1');
      expect(component.nextButtonDisabled()).toBeFalse();

      component.selectedValue.set(undefined);
      expect(component.nextButtonDisabled()).toBeTrue();
    });

    it('disables next button when value is set to empty string', () => {
      component.selectedValue.set('');
      expect(component.nextButtonDisabled()).toBeTrue();
    });
  });

  describe('nextButtonDisabled computed signal', () => {
    it('is true when selectedValue is undefined', () => {
      component.selectedValue.set(undefined);
      expect(component.nextButtonDisabled()).toBeTrue();
    });

    it('is true when selectedValue is not set (initial state)', () => {
      expect(component.nextButtonDisabled()).toBeTrue();
    });

    it('is false when selectedValue is a valid code', () => {
      component.selectedValue.set('code1');
      expect(component.nextButtonDisabled()).toBeFalse();

      component.selectedValue.set('code2');
      expect(component.nextButtonDisabled()).toBeFalse();
    });
  });

  describe('closeDialog()', () => {
    it('delegates to FollowUpMixedCodesService with selected value', async () => {
      component.selectedValue.set('code1');

      await component.closeDialog();

      expect(service.closeDialog).toHaveBeenCalledWith('code1');
    });

    it('calls service closeDialog even when selectedValue is undefined', async () => {
      component.selectedValue.set(undefined);

      await component.closeDialog();

      expect(service.closeDialog).toHaveBeenCalledWith(undefined);
    });

    it('announces dialog closure before calling service', async () => {
      const liveAnnouncer = fixture.point.injector.get(LiveAnnouncer);
      const announceSpy = spyOn(liveAnnouncer, 'announce').and.callThrough();

      component.selectedValue.set('code1');
      await component.closeDialog();

      expect(announceSpy).toHaveBeenCalled();
    });
  });

  describe('navigateToWelcomePage()', () => {
    it('closes dialog and navigates twice: "" and then "/welcome"', async () => {
      const navSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      await component.navigateToWelcomePage();

      expect(service.closeDialog).toHaveBeenCalled();
      expect(navSpy.calls.count()).toBe(2);
      expect(navSpy.calls.argsFor(0)[0]).toEqual(['']);
      expect(navSpy.calls.argsFor(1)[0]).toEqual(['/welcome']);
    });

    it('first navigates to empty route then to /welcome', async () => {
      const navSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      await component.navigateToWelcomePage();

      const firstCall = navSpy.calls.argsFor(0)[0];
      const secondCall = navSpy.calls.argsFor(1)[0];

      expect(firstCall).toEqual(['']);
      expect(secondCall).toEqual(['/welcome']);
    });

    it('calls navigate with correct parameters on successful navigation', async () => {
      const navSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      await component.navigateToWelcomePage();

      expect(navSpy).toHaveBeenCalledWith(['']);
      expect(navSpy).toHaveBeenCalledWith(['/welcome']);
    });
  });

  describe('Integration: User interaction flow', () => {
    it('next button is disabled until user selects a code', () => {
      expect(component.nextButtonDisabled()).toBeTrue();

      component.selectedValue.set(notificationCategoriesMock[0].code);
      expect(component.nextButtonDisabled()).toBeFalse();

      component.selectedValue.set(notificationCategoriesMock[1].code);
      expect(component.nextButtonDisabled()).toBeFalse();
    });

    it('closeDialog is called with selected code when user clicks next', async () => {
      component.selectedValue.set('code2');

      await component.closeDialog();

      expect(service.closeDialog).toHaveBeenCalledWith('code2');
    });

    it('allows user to select between two radio button options', () => {
      expect(component.notificationCategories[0].code).toBe('code1');
      expect(component.notificationCategories[1].code).toBe('code2');

      component.selectedValue.set('code1');
      expect(component.selectedValue()).toBe('code1');

      component.selectedValue.set('code2');
      expect(component.selectedValue()).toBe('code2');
    });

    it('back button navigates to welcome page', async () => {
      const navSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      await component.navigateToWelcomePage();

      expect(navSpy).toHaveBeenCalledTimes(2);
      expect(navSpy.calls.argsFor(1)[0]).toEqual(['/welcome']);
    });
  });

  describe('Accessibility', () => {
    it('provides radio group with aria-label', () => {
      const radioGroup = fixture.nativeElement.querySelector('mat-radio-group');
      expect(radioGroup).toBeTruthy();
      expect(radioGroup.getAttribute('aria-label')).toBe('Wählen Sie einen Meldetatbestand aus.');
    });

    it('displays both radio button options with displays', () => {
      const buttons = fixture.nativeElement.querySelectorAll('mat-radio-button');
      expect(buttons.length).toBe(2);
    });

    it('dialog title is visible', () => {
      const title = fixture.nativeElement.querySelector('#dialog-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Meldetatbestand');
    });

    it('dialog description is visible', () => {
      const description = fixture.nativeElement.querySelector('#dialog-paragraph');
      expect(description).toBeTruthy();
      expect(description.textContent).toContain('Meldetatbestand');
    });
  });
});
