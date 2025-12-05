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

import { ComponentFixture } from '@angular/core/testing';

import { FormlyRepeaterComponent } from './formly-repeater.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormlyFieldCheckbox } from '@ngx-formly/material/checkbox';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormlyFieldInput } from '@ngx-formly/material/input';
import { getButton, getInput } from '../../../test/utils/test-utils';
import { MatInputHarness } from '@angular/material/input/testing';

describe('RepeaterComponent', () => {
  let component: FormlyRepeaterComponent;
  let fixture: ComponentFixture<MockComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    return MockBuilder(MockComponent)
      .keep(FormlyRepeaterComponent)
      .keep(ReactiveFormsModule)
      .keep(
        FormlyModule.forRoot({
          types: [
            { name: 'repeat', component: FormlyRepeaterComponent },
            { name: 'checkbox', component: FormlyFieldCheckbox },
            { name: 'input', component: FormlyFieldInput },
          ],
        })
      );
  });

  beforeEach(() => {
    fixture = MockRender(MockComponent);
    const repeaterElement = fixture.debugElement.query(By.directive(FormlyRepeaterComponent));
    component = repeaterElement.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test default behavior', () => {
    it('should display the default label "Item hinzufügen"', async () => {
      const addButton = await getButton(loader, '#emails-add-button');
      const buttonText = await addButton.getText();
      expect(buttonText).toContain('Item hinzufügen');
    });

    it('should initialize with no items present', () => {
      expect(component.field.fieldGroup?.length).toBe(0);
    });

    it('should add an item when the user clicks on add button', async () => {
      const addButton = await getButton(loader, '#emails-add-button');
      await addButton.click();
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(1);
    });

    it('the id of each repeated element is made unique with its index ', async () => {
      const addButton = await getButton(loader, '#emails-add-button');
      await addButton.click();
      await addButton.click();
      await addButton.click();
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(3);
      await loader.getAllHarnesses(MatInputHarness).then(inputs => expect(inputs.length).toBe(3));
      await getInput(loader, '#email-0').then(input => expect(input).toBeTruthy());
      await getInput(loader, '#email-1').then(input => expect(input).toBeTruthy());
      await getInput(loader, '#email-2').then(input => expect(input).toBeTruthy());
    });

    it('should allow deleting an item when user clicks on delete', async () => {
      const addButton = await getButton(loader, '#emails-add-button');
      await addButton.click();
      fixture.detectChanges();

      const deleteButton = await getButton(loader, '#emails-delete-button-0');
      await deleteButton.click();
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(0);
    });
  });

  describe('when addButtonLabel = "E-Mail hinzufügen"', () => {
    beforeEach(() => {
      component.field.props = { addButtonLabel: 'E-Mail hinzufügen' };
      component.ngOnInit(); // Reinitialize the component with the new props
    });

    it('should display the label passed as prop', async () => {
      const addButton = await getButton(loader, '#emails-add-button');
      const buttonText = await addButton.getText();
      expect(buttonText.trim()).toContain('E-Mail hinzufügen');
    });
  });

  describe('when required = true', () => {
    beforeEach(() => {
      component.field.props = { required: true };
      component.ngOnInit();
    });

    it('should initialize with one item present', () => {
      expect(component.field.fieldGroup?.length).toBe(1);
    });

    it('should not allow deletion if only one item is remaining', async () => {
      const deleteButtons = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[id^="emails-delete-button"]' }));
      expect(deleteButtons.length).toBe(0);
    });
  });

  describe('setFieldCount', () => {
    beforeEach(() => {
      // Start with 2 items
      component.add();
      component.add();
      fixture.detectChanges();
    });

    it('should add items when increasing count', () => {
      component.setFieldCount(4); // Go from 2 ➔ 4
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(4);
    });

    it('should remove items when decreasing count', () => {
      component.setFieldCount(1); // Go from 2 ➔ 1
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(1);
    });

    it('should reset values when resetValues=true', () => {
      // Set dummy initial values explicitly
      component.field.fieldGroup![0].formControl!.get('email')!.setValue('foo@example.com');
      component.field.fieldGroup![1].formControl!.get('email')!.setValue('bar@example.com');
      fixture.detectChanges();

      component.setFieldCount(2, true);
      fixture.detectChanges();

      expect(component.field.fieldGroup![0].formControl!.get('email')!.value).toBeNull();
      expect(component.field.fieldGroup![1].formControl!.get('email')!.value).toBeNull();
    });

    it('should do nothing if count matches current length', () => {
      component.setFieldCount(2); // Already 2
      fixture.detectChanges();
      expect(component.field.fieldGroup?.length).toBe(2);
    });
  });
});

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  standalone: false,
})
class MockComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'canBeDeleted',
      key: 'canBeDeleted',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'E-Mails sind löschbar',
      },
    },
    {
      id: 'emails',
      key: 'emails',
      type: 'repeat',
      props: {},
      fieldArray: {
        fieldGroup: [
          {
            id: 'email',
            key: 'email',
            type: 'input',
            props: {
              label: 'E-Mail',
              required: true,
            },
          },
        ],
      },
    },
  ];
}
