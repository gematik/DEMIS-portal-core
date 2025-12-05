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

import { Component } from '@angular/core';
import { FormlyRepeaterExample1Component } from '../code-snippets/formly-repeater/example-1.component';
import { FormlyRepeaterExample2Component } from '../code-snippets/formly-repeater/example-2.component';
import { FormlyRepeaterExample3Component } from '../code-snippets/formly-repeater/example-3.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';

@Component({
  selector: 'app-paste-box-consumer',
  imports: [
    SubsectionTitleComponent,
    OverviewSectionComponent,
    ExpandableSectionsComponent,
    DocTableComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    FormlyRepeaterExample1Component,
    FormlyRepeaterExample2Component,
    FormlyRepeaterExample3Component,
  ],
  styleUrls: [],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The Formly Repeater component is a custom Formly field-type which acts as a wrapper around a Formly field or group of fields and allows the user to
          add dynamically multiple instances of the wrapped fields.
        </p>

        <app-subsection-title>Use the custom type in your project</app-subsection-title>
        <p>You need to import the Formly Repeater component and bind it to the custom type declared in your Formly config</p>
        <ul>
          <li>
            <p>NgModule-based config:</p>
            <app-code-snippet-box codeSnippetPath="code-snippets/formly-repeater/declare-custom-type-with-module-based-config.snippet.ts" language="ts" />
          </li>
          <li>
            <p>Standalone config:</p>
            <app-code-snippet-box codeSnippetPath="code-snippets/formly-repeater/declare-custom-type-standalone-config.snippet.ts" language="ts" />
          </li>
        </ul>

        <app-subsection-title>Configuration props</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Public methods</app-subsection-title>
        <app-doc-table [dataSource]="publicMethodsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Used CSS</app-subsection-title>
        <app-doc-table [dataSource]="cssDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-formly-repeater-example-1></app-formly-repeater-example-1>
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-formly-repeater-example-2></app-formly-repeater-example-2>
      </app-code-example-box>

      <app-code-example-box [options]="examples[2]">
        <app-formly-repeater-example-3></app-formly-repeater-example-3>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FormlyRepeaterConsumerComponent {
  propertiesDocTableDataSource = [
    {
      name: '`addButtonLabel`',
      description: '`[optional]` The label displayed next to the add icon (default: "Item hinzufügen")',
    },
    {
      name: '`showAddButtonLabel`',
      description: '`[optional]` If true, the label is displayed next to the add icon, in any case the label is used for screen readers (default: true)',
    },
    {
      name: '`isSingleInputField`',
      description: '`[optional]` Is true if the repeated item is a single input field. It influences the styling. (default: true)',
    },
  ];

  publicMethodsDocTableDataSource = [
    {
      name: '`setFieldCount(value: number, resetValues: boolean = false)`',
      description:
        'Adjusts the number of repeated fields rendered by the repeater and can reset the values. If value is greater than the current count, new empty items are added. ' +
        'If value is less than the current count, extra items are removed from the end. If "resetValues" is true, the values of all entries are set to null after adjusting the count.',
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Repeat a single input field',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'Repeat a section of fields',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
      ],
    },
    {
      expanderTitle: 'Example 3',
      expanderDescription: 'At least one email or tel',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-repeater',
        },
      ],
    },
  ];

  cssDocTableDataSource = [{ name: '`--color-primary`', description: 'Color variable used for the buttons' }];
}
