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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockBuilder, MockProvider } from 'ng-mocks';
import { MessageDialogService } from '../../services/message-dialog.service';
import { DEMIS_PASTE_BOX_CLIPBOARD_ERROR, PasteBoxComponent } from './paste-box.component';
import { NGXLogger } from 'ngx-logger';

describe('PasteBoxComponent', () => {
  let component: PasteBoxComponent;
  let fixture: ComponentFixture<PasteBoxComponent>;

  beforeEach(() =>
    MockBuilder([PasteBoxComponent, MatButtonModule, MatIconModule]).provide(MockProvider(MessageDialogService)).provide(MockProvider(NGXLogger))
  );

  beforeEach(async () => {
    fixture = TestBed.createComponent(PasteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dataPasted event when clipboard text is read and parsed successfully', fakeAsync(async () => {
    const clipboardText = 'URL P.family=Schulz&P.given=Klaus';
    const expectedParsedClipboardData = new Map<string, string>([
      ['P.family', 'Schulz'],
      ['P.given', 'Klaus'],
    ]);
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to resolve

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  }));

  it('should emit dataPasted event when encoded clipboard text is read and parsed successfully', fakeAsync(async () => {
    const clipboardText = 'URL F.name=ACME%20Corp.&F.bsnr=4711&F.type=1&F.street=Stairway%20To%20Heaven&F.houseNumber=911&F.zip=0815&F.city=Duckburg';
    const expectedParsedClipboardData = new Map<string, string>([
      ['F.name', 'ACME Corp.'],
      ['F.bsnr', '4711'],
      ['F.type', '1'],
      ['F.street', 'Stairway To Heaven'],
      ['F.houseNumber', '911'],
      ['F.zip', '0815'],
      ['F.city', 'Duckburg'],
    ]);
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to resolve

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  }));

  it('should emit dataPasted event when fully encoded clipboard text is read and parsed successfully', fakeAsync(async () => {
    const clipboardText =
      'URL F.name%3DACME%20Corp.%26F.bsnr%3D4711%26F.type%3D1%26F.street%3DStairway%20To%20Heaven%26F.houseNumber%3D911%26F.zip%3D0815%26F.city%3DDuckburg';
    const expectedParsedClipboardData = new Map<string, string>([
      ['F.name', 'ACME Corp.'],
      ['F.bsnr', '4711'],
      ['F.type', '1'],
      ['F.street', 'Stairway To Heaven'],
      ['F.houseNumber', '911'],
      ['F.zip', '0815'],
      ['F.city', 'Duckburg'],
    ]);
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to resolve

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  }));

  it('should call showErrorDialog when clipboard text is read successfully, but cannot be parsed', fakeAsync(async () => {
    const clipboardText = 'URL not_parsable_data';
    const showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to resolve

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  }));

  it('should call showErrorDialog when clipboard text is empty', fakeAsync(async () => {
    const clipboardText = '';
    const showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to resolve

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  }));

  it('should call showErrorDialog when clipboard read fails', fakeAsync(async () => {
    const showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    const error = new Error('Clipboard read failed');
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.reject(error));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000); // Wait for the promise to reject

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  }));

  it('should trim key and value when parsing clipboard data with newline after &', fakeAsync(async () => {
    const clipboardText = 'URL  key1 = value1  &\n  key2=  value2 ';
    const expectedParsedClipboardData = new Map<string, string>([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    spyOn(navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardText));
    spyOn(navigator.clipboard, 'writeText');
    spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    tick(1000);

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  }));
});
