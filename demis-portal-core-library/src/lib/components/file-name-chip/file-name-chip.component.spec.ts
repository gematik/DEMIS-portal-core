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

import { MatIconModule } from '@angular/material/icon';
import { FileNameChipComponent } from './file-name-chip.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('FileNameChipComponent', () => {
  let component: FileNameChipComponent;
  let fixture: MockedComponentFixture<FileNameChipComponent, FileNameChipComponent>;
  let loader: HarnessLoader;

  beforeEach(() => MockBuilder(FileNameChipComponent).keep(FileSizePipe).mock(MatIconModule).mock(MatButtonModule).mock(MatChipsModule));

  beforeEach(() => {
    fixture = MockRender(FileNameChipComponent);
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the file name', () => {
    const fileName = 'test-file.txt';
    fixture.componentInstance.fileName = fileName;
    fixture.detectChanges();
    const chipElement = fixture.point.nativeElement.querySelector('.file-name');
    expect(chipElement.textContent).toBe(fileName);
  });

  it('should display the file name with file size if provided', () => {
    const fileName = 'test-file.txt';
    fixture.componentInstance.fileName = fileName;
    const fileSize = 1023;
    fixture.componentInstance.fileSize = fileSize;
    fixture.detectChanges();
    const fileSizeElement = fixture.point.nativeElement.querySelector('.file-name');
    expect(fileSizeElement.textContent).toBe(`${fileName} (${fileSize} bytes)`);
  });

  it('should emit fileDeleted event when delete button is clicked and canDelete', async () => {
    fixture.componentInstance.canDelete = true;
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
    fixture.componentInstance.canDelete = false;
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
