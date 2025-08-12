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

import { TestBed } from '@angular/core/testing';

import { ErrorDialogInsertDataFromClipboard, DialogStyle, ErrorsDialogProps, MessageDialogService, SubmitDialogProps } from './message-dialog.service';
import { ErrorDialogComponent, ErrorDialogData } from '../components/error-dialog/error-dialog.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { ErrorDialogWithSearchInKbComponent } from '../components/error-dialog-with-search-in-kb/error-dialog-with-search-in-kb.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SubmitDialogComponent } from '../components/submit-dialog/submit-dialog.component';

describe('MessageDialogService', () => {
  let service: MessageDialogService;
  let matDialog: MatDialog;

  const defaultStyle = {
    height: '600px',
    width: '800px',
    maxWidth: '800px',
    disableClose: false,
  } as DialogStyle;

  const defaultSubmitStyle = {
    height: '385px',
    width: '610px',
    disableClose: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockComponent(ErrorDialogComponent), MockComponent(SubmitDialogComponent), MockModule(MatDialogModule)],
    });
    service = TestBed.inject(MessageDialogService);
    matDialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the matDialog with correct component and data', () => {
    const data = {
      errorTitle: signal('Test Error'),
      errors: signal([new Error('Something went wrong')]),
    } as ErrorDialogData;
    const openSpy = spyOn(matDialog, 'open');
    service.error(data);
    expect(openSpy).toHaveBeenCalledWith(ErrorDialogComponent, { data });
  });

  describe('should open the MatDialog with the search-compatible component and the correct data', () => {
    const data = {
      errorTitle: 'Test Error',
      clipboardContent: 'Test Clipboard Content',
      errors: [
        { text: 'error1', queryString: 'query1' },
        { text: 'error2', queryString: 'query2' },
      ],
    } as ErrorsDialogProps;

    it('case 1: user wants error dialog to be closable', () => {
      const openSpy = spyOn(matDialog, 'open');
      service.showErrorDialog(data);
      expect(openSpy).toHaveBeenCalledWith(ErrorDialogWithSearchInKbComponent, { data, ...defaultStyle });
    });

    it('case 2: user wants to force a redirect to homepage', () => {
      const dataWithRedirect = {
        ...data,
        redirectToHome: true,
      } as ErrorsDialogProps;

      const defaultStyleWithCloseDisabled = {
        ...defaultStyle,
        disableClose: true,
      };
      const openSpy = spyOn(matDialog, 'open');
      service.showErrorDialog(dataWithRedirect);
      expect(openSpy).toHaveBeenCalledWith(ErrorDialogWithSearchInKbComponent, {
        data: dataWithRedirect,
        ...defaultStyleWithCloseDisabled,
      });
    });
  });

  describe('should call specific dialog for specific use case', () => {
    it('call dialog for error occurring during data import from clipboard', () => {
      const serviceSpy = spyOn(service, 'showErrorDialog');
      service.showErrorDialogInsertDataFromClipboard();
      expect(serviceSpy).toHaveBeenCalledWith(ErrorDialogInsertDataFromClipboard);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('extractMessageFromError', () => {
    it('should return message from error.error.message', () => {
      const error = new HttpErrorResponse({
        error: { message: 'Serverfehler' },
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(service.extractMessageFromError(error)).toBe('Serverfehler');
    });

    it('should return message from error.error', () => {
      const error = new HttpErrorResponse({
        error: 'Etwas ist schiefgelaufen',
        status: 400,
        statusText: 'Bad Request',
        url: '/api/test',
      });

      expect(service.extractMessageFromError(error)).toBe('Etwas ist schiefgelaufen');
    });

    it('should return error.message if error.error empty', () => {
      const error = new HttpErrorResponse({
        error: {},
        status: 500,
        statusText: 'Internal Server Error',
      });
      (error as any).message = 'Fallback-Fehler';

      expect(service.extractMessageFromError(error)).toBe('Fallback-Fehler');
    });

    it('should return error.message if no error.error ', () => {
      const customError = {
        message: 'Schlimmer Fehler',
        status: 400,
      };
      expect(service.extractMessageFromError(customError)).toBe('Schlimmer Fehler');
    });

    it('should return message from plain Error object', () => {
      const error = new Error('Etwas ist kaputt');
      expect(service.extractMessageFromError(error)).toBe('Etwas ist kaputt');
    });

    it('should return raw string if error is a string', () => {
      const error = 'Fehler als String';
      expect(service.extractMessageFromError(error)).toBe('Fehler als String');
    });

    it('should return default message for unknown error shape', () => {
      const error = { foo: 'bar' };
      expect(service.extractMessageFromError(error)).toBe('Unbekannter Fehler');
    });

    it('should return default message for null or undefined', () => {
      expect(service.extractMessageFromError(null)).toBe('Unbekannter Fehler');
      expect(service.extractMessageFromError(undefined)).toBe('Unbekannter Fehler');
    });
  });

  describe('showSubmitDialog', () => {
    const submitData = {
      notificationId: '123-456-789',
      timestamp: '12.12.2024 12:00:00',
      fileName: 'test-file.pdf',
      href: 'blob:test-url',
      authorEmail: 'test@example.com',
    } as SubmitDialogProps;

    it('should open the MatDialog with SubmitDialogComponent and default style', () => {
      const openSpy = spyOn(matDialog, 'open');
      service.showSubmitDialog(submitData);
      expect(openSpy).toHaveBeenCalledWith(SubmitDialogComponent, {
        data: submitData,
        ...defaultSubmitStyle,
      });
    });

    it('should open the MatDialog with custom style when provided', () => {
      const customStyle = {
        height: '500px',
        width: '700px',
      } as DialogStyle;
      const expectedConfig = {
        data: submitData,
        height: '500px',
        width: '700px',
        disableClose: true,
      };
      const openSpy = spyOn(matDialog, 'open');
      service.showSubmitDialog(submitData, customStyle);
      expect(openSpy).toHaveBeenCalledWith(SubmitDialogComponent, expectedConfig);
    });

    it('should always set disableClose to true to prevent closing the dialog', () => {
      const openSpy = spyOn(matDialog, 'open');
      service.showSubmitDialog(submitData);

      const calledConfig = openSpy.calls.mostRecent().args[1];
      expect(calledConfig!.disableClose).toBe(true);
    });

    it('should maintain disableClose as true even with custom style', () => {
      const customStyle = {
        height: '500px',
        width: '700px',
      } as DialogStyle;
      const openSpy = spyOn(matDialog, 'open');
      service.showSubmitDialog(submitData, customStyle);

      const calledConfig = openSpy.calls.mostRecent().args[1];
      expect(calledConfig!.disableClose).toBe(true);
    });
  });
});
