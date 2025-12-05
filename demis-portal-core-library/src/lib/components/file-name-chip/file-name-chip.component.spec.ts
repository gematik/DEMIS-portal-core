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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { MatIconModule } from '@angular/material/icon';
import { FileNameChipComponent, FILE_NAME_CHIP_DEFAULTS } from './file-name-chip.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('FileNameChipComponent', () => {
  const fileName = 'test-file.txt';

  beforeEach(() => MockBuilder(FileNameChipComponent).keep(FileSizePipe).mock(MatIconModule).mock(MatButtonModule).mock(MatChipsModule));

  it('should create the component', () => {
    // InputSignals werden direkt an MockRender übergeben
    const fixture = MockRender(FileNameChipComponent, { fileName: fileName });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the file name', () => {
    const fixture = MockRender(FileNameChipComponent, { fileName: fileName });
    fixture.detectChanges();
    const chipElement = fixture.point.nativeElement.querySelector('.file-name');
    expect(chipElement.textContent).toBe(fileName);
  });

  it('should display the file name with file size if provided', () => {
    const fileSize = 1024;
    // InputSignals werden direkt über MockRender gesetzt
    const fixture = MockRender(FileNameChipComponent, { fileName: fileName, fileSize: fileSize });
    fixture.detectChanges();
    const fileSizeElement = fixture.point.nativeElement.querySelector('.file-name');
    expect(fileSizeElement.textContent).toContain(fileName);
    expect(fileSizeElement.textContent).toContain('1.00 KB'); // FileSizePipe formatiert 1024 als "1 KB"
  });

  it('should emit fileDeleted event when delete button is clicked and canDelete', async () => {
    // Verwendung der exportierten Standardwerte
    const fixture = MockRender(FileNameChipComponent, {
      fileName: fileName,
      canDelete: FILE_NAME_CHIP_DEFAULTS.canDelete,
    });
    const component = fixture.point.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const onDeleteClickedSpy = spyOn(component, 'onDeleteClicked').and.callThrough();
    const emitSpy = spyOn(component.fileDeleted, 'emit');
    const deleteButton = await loader.getHarness(MatButtonHarness.with({ selector: '#file-delete-button' }));
    expect(deleteButton).toBeDefined();
    await deleteButton.click();
    expect(onDeleteClickedSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should NOT emit fileDeleted event when delete button is clicked and !canDelete', async () => {
    // InputSignal canDelete auf false setzen
    const fixture = MockRender(FileNameChipComponent, { fileName: fileName, canDelete: false });
    const component = fixture.point.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const onDeleteClickedSpy = spyOn(component, 'onDeleteClicked').and.callThrough();
    const emitSpy = spyOn(component.fileDeleted, 'emit');
    const deleteButton = await loader.getHarness(MatButtonHarness.with({ selector: '#file-delete-button' }));
    expect(deleteButton).toBeDefined();
    await deleteButton.click();
    expect(onDeleteClickedSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
