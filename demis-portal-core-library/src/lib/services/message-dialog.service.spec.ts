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



import { TestBed } from '@angular/core/testing';

import { ErrorDialogStyle, ErrorsDialogProps, MessageDialogService } from './message-dialog.service';
import { ErrorDialogComponent, ErrorDialogData } from '../components/error-dialog/error-dialog.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { ErrorDialogWithSearchInKbComponent } from '../components/error-dialog-with-search-in-kb/error-dialog-with-search-in-kb.component';

describe('MessageDialogService', () => {
  let service: MessageDialogService;
  let matDialog: MatDialog;

  const defaultStyle = {
    height: '600px',
    width: '800px',
    maxWidth: '800px',
  } as ErrorDialogStyle;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockComponent(ErrorDialogComponent), MockModule(MatDialogModule)],
    });
    service = TestBed.inject(MessageDialogService);
    matDialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the dialog open method with the correct component and data', () => {
    const data = { errorTitle: signal('Test Error'), errors: signal([new Error('Something went wrong')]) } as ErrorDialogData;
    const openSpy = spyOn(matDialog, 'open');
    service.error(data);
    expect(openSpy).toHaveBeenCalledWith(ErrorDialogComponent, { data });
  });

  it('should call the dialog open method with search correct data', () => {
    const data = {
      errorTitle: 'Test Error',
      clipboardContent: 'Test Clipboard Content',
      errors: [
        { text: 'error1', queryString: 'query1' },
        { text: 'error2', queryString: 'query2' },
      ],
    } as ErrorsDialogProps;
    const openSpy = spyOn(matDialog, 'open');
    service.errorWithSearch(data);
    expect(openSpy).toHaveBeenCalledWith(ErrorDialogWithSearchInKbComponent, { data, ...defaultStyle });
  });
});
