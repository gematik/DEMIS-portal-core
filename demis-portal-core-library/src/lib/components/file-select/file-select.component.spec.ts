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

import { FileSelectComponent } from './file-select.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { MatIconModule } from '@angular/material/icon';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom } from 'rxjs';

describe('FileSelectComponent', () => {
  let component: FileSelectComponent;
  let fixture: MockedComponentFixture<FileSelectComponent, FileSelectComponent>;

  beforeEach(() => MockBuilder(FileSelectComponent).mock(MatIconModule).mock(NGXLogger));

  beforeEach(() => {
    fixture = MockRender(FileSelectComponent);
    component = fixture.point.componentInstance;
    fixture.componentInstance.acceptedFileTypes = '*/*';
    fixture.componentInstance.multipleFilesSelectable = false;
    fixture.componentInstance.displayText = 'Wählen Sie eine Datei aus';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default displayText', () => {
    expect(component.displayText).toBe('Wählen Sie eine Datei aus');
  });

  it('should have default acceptedFileTypes', () => {
    expect(component.acceptedFileTypes).toBe('*/*');
  });

  it('should have default multipleFilesSelectable', () => {
    expect(component.multipleFilesSelectable).toBe(false);
  });

  it('should emit file selection when a single file is selected', async () => {
    const file = new File(['test'], 'test.txt');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileInput = fixture.point.nativeElement.querySelector('input');
    fileInput.files = dataTransfer.files;

    fileInput.dispatchEvent(new Event('change'));

    await expectAsync(firstValueFrom(component.onFileSelected)).toBeResolvedTo(dataTransfer.files);
  });

  it('should emit file selection when multiple files are selected', async () => {
    const file1 = new File(['test1'], 'test1.txt');
    const file2 = new File(['test2'], 'test2.txt');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);
    const fileInput = fixture.point.nativeElement.querySelector('input');
    fileInput.files = dataTransfer.files;

    fileInput.dispatchEvent(new Event('change'));

    await expectAsync(firstValueFrom(component.onFileSelected)).toBeResolvedTo(dataTransfer.files);
  });

  it('should emit null when no file is selected', async () => {
    const event = { target: { files: new DataTransfer().files } } as any;

    component.onChange(event);

    await expectAsync(firstValueFrom(component.onFileSelected)).toBeResolvedTo(null);
  });
});
