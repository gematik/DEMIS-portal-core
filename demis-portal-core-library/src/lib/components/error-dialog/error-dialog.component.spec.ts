/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogComponent, ErrorDialogData } from './error-dialog.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { signal } from '@angular/core';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: MockedComponentFixture<ErrorDialogComponent, ErrorDialogComponent>;
  const TEST_ERROR_TITLE = 'Test Error Title';
  const TEST_ERRORS = [new Error('something went wrong')];

  const componentTests = (testErrorTitle: string, testErrors: Error[]) => {
    it('should create', () => {
      expect(fixture).toBeDefined();
      expect(component).toBeTruthy();
    });

    it('should have the correct error title', () => {
      fixture.detectChanges();
      expect(component.errorTitle()).toBe(testErrorTitle);
    });

    it('should have the correct errors', () => {
      fixture.detectChanges();
      const errors = component.errors();
      expect(errors.length).toBe(testErrors.length);
      for (let i = 0; i < testErrors.length; i++) {
        expect(errors[i]).toEqual(testErrors[i]);
      }
    });
  };

  describe('without data', () => {
    beforeEach(() =>
      MockBuilder(ErrorDialogComponent).mock(MatIconModule).mock(MatDialogModule).mock(MatDividerModule).mock(MatButtonModule).mock(MAT_DIALOG_DATA)
    );

    beforeEach(() => {
      fixture = MockRender(ErrorDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    componentTests('', []);
  });

  describe('with data', () => {
    beforeEach(() =>
      MockBuilder(ErrorDialogComponent)
        .mock(MatIconModule)
        .mock(MatDialogModule)
        .mock(MatDividerModule)
        .mock(MatButtonModule)
        .mock(MAT_DIALOG_DATA, { errorTitle: signal(TEST_ERROR_TITLE), errors: signal(TEST_ERRORS) } as ErrorDialogData)
    );

    beforeEach(() => {
      fixture = MockRender(ErrorDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    componentTests(TEST_ERROR_TITLE, TEST_ERRORS);
  });
});
