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

import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { FormlyDatepickerComponent } from '../../lib/components/formly-datepicker/formly-datepicker.component';
import { MatInputHarness } from '@angular/material/input/testing';

export function getButton(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatButtonHarness.with({ selector: selector }));
}

export function getInput(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatInputHarness.with({ selector: selector }));
}

export async function getDatepicker(loader: HarnessLoader, inputId: string): Promise<MatDatepickerInputHarness> {
  return await loader.getHarness(
    MatDatepickerInputHarness.with({
      selector: inputId,
    })
  );
}

export async function getHintForFormFieldWithLabel(loader: HarnessLoader, inputLabel: string): Promise<string> {
  const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: inputLabel }));
  return (await formField.getTextHints())[0];
}

export async function getErrorFor(loader: HarnessLoader, inputWithlabel: string): Promise<string> {
  const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: inputWithlabel }));
  return (await formField.getTextErrors())[0];
}

export async function checkValidationError({ loader, component, controlName, label, value, expectedMessage }: CheckValidationErrorParams) {
  const fieldId = `#${controlName}-datepicker-input-field`;
  const input = await getDatepicker(loader, fieldId);
  await input.setValue(value);
  await input.blur();

  expect(component.form.get(controlName)?.invalid).toBeTrue();

  const error = await getErrorFor(loader, label);
  expect(error).toBe(expectedMessage);
}

declare type CheckValidationErrorParams = {
  loader: HarnessLoader;
  component: FormlyDatepickerComponent;
  controlName: string;
  label: string;
  value: string;
  expectedMessage: string;
};
