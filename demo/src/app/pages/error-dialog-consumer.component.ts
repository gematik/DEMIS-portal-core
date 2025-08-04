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

import { Component } from '@angular/core';
import { ErrorDialogExample1Component } from '../code-snippets/error-dialog/example-1.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent, DocTableRowData } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-error-dialog',
  imports: [
    OverviewSectionComponent,
    SubsectionTitleComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    ErrorDialogExample1Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          In order to display messages to the end user, there is a message dialog service available. This service is capable of opening dedicated dialogs for
          particular occasions.
        </p>

        <p>See the examples below for the different ways to use the message dialog service.</p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { MessageDialogService } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource"></app-doc-table>

        <app-subsection-title>showErrorDialog - Parameters</app-subsection-title>
        <app-doc-table [dataSource]="showErrorDialogDocTableDataSource"></app-doc-table>

        <app-subsection-title>Interface ErrorsDialogProps - Properties</app-subsection-title>
        <app-doc-table [dataSource]="errorsDialogPropsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Interface ErrorMessage - Properties</app-subsection-title>
        <app-doc-table [dataSource]="errorMessageDocTableDataSource"></app-doc-table>

        <app-subsection-title>Interface ErrorDialogStyle - Properties</app-subsection-title>
        <app-doc-table [dataSource]="errorDialogStyleDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-error-dialog-example-1></app-error-dialog-example-1>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class ErrorDialogConsumerComponent {
  methodsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`showErrorDialog`',
      description: [
        'Opens an error dialog, that is able to show a list of errors.',
        'Each error can have a search query attached. If so, the error message contains a link button to direct the user to the DEMIS Knowledge Base.',
      ],
    },
  ];

  showErrorDialogDocTableDataSource: DocTableRowData[] = [
    { name: '`data: ErrorsDialogProps`', description: 'The data object used to render the error dialog.' },
    { name: '`style?: ErrorDialogStyle`', description: '`[optional]` Overwrite styles of the message dialog.' },
  ];

  errorsDialogPropsDocTableDataSource: DocTableRowData[] = [
    { name: '`errors: ErrorMessage[]`', description: 'The array of error messages to be displayed in the error dialog.' },
    { name: '`clipboardContent?: string`', description: '`[optional]`' },
    { name: '`errorTitle?: string`', description: '`[optional]` Overwrites the default dialog title.' },
  ];

  errorMessageDocTableDataSource: DocTableRowData[] = [
    { name: '`text: string`', description: 'The error text message to be displayed in the error dialog.' },
    { name: '`queryString?: string`', description: '`[optional]` A search string that will trigger a button to direct the user to the DEMIS Knowledge Base.' },
  ];

  errorDialogStyleDocTableDataSource: DocTableRowData[] = [
    { name: '`height?: string`', description: '`[optional]` Overwrites the height config values of the Material Dialog used.' },
    { name: '`width?: string`', description: '`[optional]` Overwrites the width config values of the Material Dialog used.' },
    { name: '`maxWidth?: string`', description: '`[optional]` Overwrites the maxWidth config values of the Material Dialog used.' },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A simple error dialog with 1 error',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/error-dialog',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/error-dialog',
        },
      ],
    },
  ];
}
