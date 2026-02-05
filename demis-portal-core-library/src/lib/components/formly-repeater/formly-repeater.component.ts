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

import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FieldTypeConfig, FormlyField, FormlyFieldConfig, FormlyFieldProps, provideFormlyCore } from '@ngx-formly/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'gem-demis-repeater',
  templateUrl: './formly-repeater.component.html',
  styleUrls: ['./formly-repeater.component.scss'],
  imports: [MatIcon, MatButton, MatIconButton, NgClass, FormlyField],
  standalone: true,
  providers: [provideFormlyCore()],
})
export class FormlyRepeaterComponent extends FieldArrayType<FieldTypeConfig> implements OnInit {
  addButtonLabel!: string;
  showAddButtonLabel!: boolean;
  isSingleInputField!: boolean;

  private get repeaterProps(): RepeaterCustomProps {
    return this.props as RepeaterCustomProps;
  }

  ngOnInit() {
    this.initializeProperties();
    if (this.repeaterProps.required && this.field.fieldGroup?.length === 0) {
      this.add();
    }
    this.field.props['setFieldCount'] = this.setFieldCount.bind(this);
  }

  private initializeProperties() {
    this.addButtonLabel = this.repeaterProps?.addButtonLabel ?? 'Item hinzufügen';
    this.showAddButtonLabel = this.repeaterProps?.showAddButtonLabel ?? true;
    this.isSingleInputField = this.repeaterProps?.isSingleInputField ?? true;
  }

  get deletable(): boolean {
    const onlyOneItemRemaining: boolean = this.field.fieldGroup?.length === 1;
    const isRequired: boolean = this.repeaterProps?.required ?? false;
    return !(onlyOneItemRemaining && isRequired);
  }

  /**
   * Adjusts the number of repeated fields rendered by the repeater.
   * If value is greater than the current count, new empty items are added.
   * If value is less than the current count, extra items are removed from the end.
   * @param value - The desired number of repeated field entries.
   * @param resetValues -  If true, resets the values of all entries to null after adjusting the count. Defaults to false.
   */
  setFieldCount(value: number, resetValues: boolean = false) {
    if (this.field.fieldGroup) {
      const currentLength = this.field.fieldGroup.length;
      const difference = value - currentLength;
      if (difference > 0) {
        Array(difference)
          .fill(null)
          .forEach(() => this.add());
      } else if (difference < 0) {
        for (let i = currentLength - 1; i >= value; i--) {
          this.remove(i);
        }
      }
      if (resetValues) this.field.fieldGroup?.forEach(f => f.formControl?.reset(null));
    }
  }

  setIdNames(formlyField: FormlyFieldConfig, index: number): string {
    this.setIdNameInChildElements(formlyField, index);
    return formlyField.parent?.id + '-' + index;
  }

  /**
   * Appends a unique index-based suffix to the IDs of child elements in a repeater field.
   * This ensures uniqueness but does not generate new IDs — it reuses existing ones from the Formly config.
   * Note: Does not support nested repeater fields.
   * @param formlyField
   * @param index
   * @private
   */
  private setIdNameInChildElements(formlyField: FormlyFieldConfig, index: number) {
    formlyField.fieldGroup!.forEach((field: FormlyFieldConfig) => {
      field.id = this.createRepeatId(field.id!, index);
    });
  }

  createRepeatId(identifier: string, index: number): string {
    if (/\d/.test(identifier)) {
      identifier = identifier.substring(0, identifier.length - 2);
    }
    return `${identifier}-${index}`;
  }
}

interface RepeaterCustomProps extends FormlyFieldProps {
  addButtonLabel?: string;
  showAddButtonLabel?: boolean;
  isSingleInputField?: boolean;
}
