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

import { FileSelectComponent, FILE_SELECT_DEFAULTS } from './file-select.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatIconModule } from '@angular/material/icon';
import { NGXLogger } from 'ngx-logger';

describe('FileSelectComponent', () => {
  beforeEach(() =>
    MockBuilder(FileSelectComponent)
      .mock(MatIconModule)
      .provide({
        provide: NGXLogger,
        useValue: { error: jasmine.createSpy('error'), debug: jasmine.createSpy('debug') },
      })
  );

  it('should create the component', () => {
    const fixture = MockRender(FileSelectComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have default displayText', () => {
    // Verwendung der exportierten Standardwerte
    const fixture = MockRender(FileSelectComponent, { displayText: FILE_SELECT_DEFAULTS.displayText });
    const component = fixture.point.componentInstance;
    expect(component.displayText()).toBe(FILE_SELECT_DEFAULTS.displayText);
  });

  it('should have custom displayText when provided', () => {
    const customText = 'Bitte wählen Sie Ihre Datei';
    const fixture = MockRender(FileSelectComponent, { displayText: customText });
    const component = fixture.point.componentInstance;
    expect(component.displayText()).toBe(customText);
  });

  it('should have default acceptedFileTypes', () => {
    // Verwendung der exportierten Standardwerte
    const fixture = MockRender(FileSelectComponent, { acceptedFileTypes: FILE_SELECT_DEFAULTS.acceptedFileTypes });
    const component = fixture.point.componentInstance;
    expect(component.acceptedFileTypes()).toBe(FILE_SELECT_DEFAULTS.acceptedFileTypes);
  });

  it('should have custom acceptedFileTypes when provided', () => {
    const customFileTypes = '.pdf,.doc,.docx';
    const fixture = MockRender(FileSelectComponent, { acceptedFileTypes: customFileTypes });
    const component = fixture.point.componentInstance;
    expect(component.acceptedFileTypes()).toBe(customFileTypes);
  });

  it('should have default multipleFilesSelectable', () => {
    // Verwendung der exportierten Standardwerte
    const fixture = MockRender(FileSelectComponent, { multipleFilesSelectable: FILE_SELECT_DEFAULTS.multipleFilesSelectable });
    const component = fixture.point.componentInstance;
    expect(component.multipleFilesSelectable()).toBe(FILE_SELECT_DEFAULTS.multipleFilesSelectable);
  });

  it('should have custom multipleFilesSelectable when provided', () => {
    const fixture = MockRender(FileSelectComponent, { multipleFilesSelectable: true });
    const component = fixture.point.componentInstance;
    expect(component.multipleFilesSelectable()).toBe(true);
  });

  it('should emit file selection when a single file is selected', () => {
    const fixture = MockRender(FileSelectComponent);
    const component = fixture.point.componentInstance;
    fixture.detectChanges();

    const file = new File(['test'], 'test.txt');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Spy on the output signal emit method
    const emitSpy = spyOn(component.onFileSelected, 'emit');

    const fileInput = fixture.point.nativeElement.querySelector('input');
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(dataTransfer.files);
  });

  it('should emit file selection when multiple files are selected', () => {
    const fixture = MockRender(FileSelectComponent, { multipleFilesSelectable: true });
    const component = fixture.point.componentInstance;
    fixture.detectChanges();

    const file1 = new File(['test1'], 'test1.txt');
    const file2 = new File(['test2'], 'test2.txt');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);

    // Spy on the output signal emit method
    const emitSpy = spyOn(component.onFileSelected, 'emit');

    const fileInput = fixture.point.nativeElement.querySelector('input');
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(dataTransfer.files);
  });

  it('should emit null when no file is selected', () => {
    const fixture = MockRender(FileSelectComponent);
    const component = fixture.point.componentInstance;

    // Spy on the output signal emit method
    const emitSpy = spyOn(component.onFileSelected, 'emit');

    const event = { target: { files: new DataTransfer().files } } as any;
    component.onChange(event);

    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should reset input value after file selection', () => {
    const fixture = MockRender(FileSelectComponent);
    fixture.detectChanges();

    const file = new File(['test'], 'test.txt');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.point.nativeElement.querySelector('input');
    fileInput.files = dataTransfer.files;

    // Spy on the value setter to verify it gets called
    const valueSetter = spyOnProperty(fileInput, 'value', 'set');

    fileInput.dispatchEvent(new Event('change'));

    // Verify that the value is reset to empty string
    expect(valueSetter).toHaveBeenCalledWith('');
  });

  it('should log error and emit null when target is not an input element', () => {
    const fixture = MockRender(FileSelectComponent);
    const component = fixture.point.componentInstance;
    const mockLogger = fixture.componentRef.injector.get(NGXLogger);

    const emitSpy = spyOn(component.onFileSelected, 'emit');

    // Test with no target
    component.onChange({ target: null } as any);
    expect(mockLogger.error).toHaveBeenCalledWith('no file selected');
    expect(emitSpy).toHaveBeenCalledWith(null);

    // Reset spies
    (mockLogger.error as jasmine.Spy).calls.reset();
    emitSpy.calls.reset();

    // Test with non-input target
    component.onChange({ target: document.createElement('div') } as any);
    expect(mockLogger.error).toHaveBeenCalledWith('no file selected');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });
});
