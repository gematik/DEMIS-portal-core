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

import { Component } from '@angular/core';
import { MessageDialogExample1Component } from '../code-snippets/message-dialog-service/example-1.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent, DocTableRowData } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { MessageDialogExample2Component } from '../code-snippets/message-dialog-service/example-2.component';
import { MessageDialogExample3Component } from '../code-snippets/message-dialog-service/example-3.component';
import { MessageDialogExample4Component } from '../code-snippets/message-dialog-service/example-4.component';
import { MessageDialogExample5Component } from '../code-snippets/message-dialog-service/example-5.component';

@Component({
  selector: 'app-message-dialog',
  imports: [
    OverviewSectionComponent,
    SubsectionTitleComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    MessageDialogExample1Component,
    MessageDialogExample2Component,
    MessageDialogExample3Component,
    MessageDialogExample4Component,
    MessageDialogExample5Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          In order to display messages to the end user, there is a message dialog service available. This service is capable of opening dedicated dialogs for
          particular occasions.
        </p>

        <p>See the examples below for the different ways to use the message dialog service.</p>
        <p>Error messages support multi-line text via newline characters (<code>\\n</code>). The dialog preserves line breaks when rendering.</p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { MessageDialogService } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource" />

        <app-subsection-title>showErrorDialog - Parameters</app-subsection-title>
        <app-doc-table [dataSource]="showErrorDialogDocTableDataSource" />

        <app-subsection-title>showSubmitDialog - Parameters</app-subsection-title>
        <app-doc-table [dataSource]="showSubmitDialogDocTableDataSource" />

        <app-subsection-title>showSpinnerDialog - Parameters</app-subsection-title>
        <app-doc-table [dataSource]="showSpinnerDialogDocTableDataSource" />

        <app-subsection-title>Interface ErrorsDialogProps - Properties</app-subsection-title>
        <app-doc-table [dataSource]="errorsDialogPropsDocTableDataSource" />

        <app-subsection-title>Interface SubmitDialogProps - Properties</app-subsection-title>
        <app-doc-table [dataSource]="submitDialogPropsDocTableDataSource" />

        <app-subsection-title>Interface SpinnerDialogProps - Properties</app-subsection-title>
        <app-doc-table [dataSource]="spinnerDialogPropsDocTableDataSource" />

        <app-subsection-title>Interface ErrorMessage - Properties</app-subsection-title>
        <app-doc-table [dataSource]="errorMessageDocTableDataSource" />

        <app-subsection-title>Enum SeverityEnum - Values</app-subsection-title>
        <app-doc-table [dataSource]="severityEnumDocTableDataSource" />

        <app-subsection-title>Interface DialogStyle - Properties</app-subsection-title>
        <app-doc-table [dataSource]="dialogStyleDocTableDataSource" />
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-message-dialog-example-1 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[1]">
        <app-message-dialog-example-2 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[2]">
        <app-message-dialog-example-3 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[3]">
        <app-message-dialog-example-4 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[4]">
        <app-message-dialog-example-5 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class MessageDialogConsumerComponent {
  methodsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`showErrorDialog`',
      description: [
        'Opens an error dialog, that is able to show a list of errors.',
        'Each error can have a search query attached. If so, the error message contains a link button to direct the user to the DEMIS Knowledge Base.',
      ],
    },
    {
      name: '`showSubmitDialog`',
      description: [
        'Opens a successful confirmation dialog after submitting a notification.',
        'Shows notification details including ID, timestamp, and provides a PDF download link.',
        'The dialog automatically triggers a PDF download and provides navigation back to the homepage.',
        'The dialog cannot be closed by clicking outside or pressing ESC (disableClose: true).',
      ],
    },
    {
      name: '`showSpinnerDialog`',
      description: [
        'Opens a spinner dialog to indicate loading or processing state.',
        'The dialog cannot be closed by clicking outside or pressing ESC (disableClose: true).',
        'Must be closed programmatically using closeSpinnerDialog() method.',
      ],
    },
    {
      name: '`closeSpinnerDialog`',
      description: ['Closes the currently opened spinner dialog.', 'Safe to call even when no spinner dialog is currently open.'],
    },
  ];

  showErrorDialogDocTableDataSource: DocTableRowData[] = [
    { name: '`data: ErrorsDialogProps`', description: 'The data object used to render the error dialog.' },
    { name: '`style?: DialogStyle`', description: '`[optional]` Overwrite styles of the message dialog.' },
  ];

  showSubmitDialogDocTableDataSource: DocTableRowData[] = [
    { name: '`data: SubmitDialogProps`', description: 'The data object used to render the submit success dialog.' },
    {
      name: '`style?: DialogStyle`',
      description: '`[optional]` Overwrite styles of the message dialog. Note: disableClose is always set to true.',
    },
  ];

  showSpinnerDialogDocTableDataSource: DocTableRowData[] = [
    { name: '`data: SpinnerDialogProps`', description: 'The data object used to render the spinner dialog.' },
    {
      name: '`style?: DialogStyle`',
      description: '`[optional]` Overwrite styles of the message dialog. Note: disableClose is always set to true.',
    },
  ];

  errorsDialogPropsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`errors: ErrorMessage[]`',
      description: 'The array of error messages to be displayed in the error dialog.',
    },
    { name: '`clipboardContent?: string`', description: '`[optional]` Content to be copied to the clipboard when the user clicks the copy button.' },
    { name: '`errorTitle?: string`', description: '`[optional]` Overwrites the default dialog title.' },
    {
      name: '`redirectToHome?: boolean`',
      description:
        '`[optional]` If true, the close button navigates to the home page instead of just closing the dialog. Also sets disableClose on the Material Dialog.',
    },
    {
      name: '`logFilteringEnabled?: boolean`',
      description:
        '`[optional]` Temporary feature flag that activates severity-based filtering of error messages. When enabled, only errors meeting the `minSeverityLevel` threshold are shown. This property will be removed once the corresponding feature flag (`FEATURE_FLAG_PORTAL_ERROR_DIALOG_FILTERING`) is retired.',
    },
    {
      name: '`minSeverityLevel?: SeverityEnum`',
      description: '`[optional]` The minimum severity level to display when filtering is enabled. Defaults to `SeverityEnum.ERROR`.',
    },
  ];

  submitDialogPropsDocTableDataSource: DocTableRowData[] = [
    { name: '`notificationId: string`', description: 'The unique identifier for the submitted notification.' },
    { name: '`timestamp: string`', description: 'The formatted timestamp when the notification was submitted.' },
    { name: '`fileName: string`', description: 'The name of the PDF file to be downloaded.' },
    { name: '`href: string`', description: 'The download URL for the PDF confirmation file.' },
    { name: '`authorEmail: string`', description: 'The email address for support contact.' },
  ];

  spinnerDialogPropsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`message: string`',
      description: 'The message to display alongside the spinner.',
    },
  ];

  errorMessageDocTableDataSource: DocTableRowData[] = [
    { name: '`text: string`', description: 'The error text message to be displayed in the error dialog. Supports multi-line text via newline characters.' },
    {
      name: '`queryString?: string`',
      description: '`[optional]` A search string that will trigger a button to direct the user to the DEMIS Knowledge Base.',
    },
    {
      name: '`severity?: SeverityEnum`',
      description:
        '`[optional]` The severity level of the error message. Used for filtering when `logFilteringEnabled` is set. Defaults to `ERROR` if not specified.',
    },
  ];

  dialogStyleDocTableDataSource: DocTableRowData[] = [
    {
      name: '`height?: string`',
      description: '`[optional]` Overwrites the height config values of the Material Dialog used.',
    },
    {
      name: '`width?: string`',
      description: '`[optional]` Overwrites the width config values of the Material Dialog used.',
    },
    {
      name: '`maxWidth?: string`',
      description: '`[optional]` Overwrites the maxWidth config values of the Material Dialog used.',
    },
  ];

  severityEnumDocTableDataSource: DocTableRowData[] = [
    { name: '`FATAL`', description: 'Highest severity. Value: `"fatal"`.' },
    { name: '`ERROR`', description: 'Standard error severity. Value: `"error"`. This is the default when no severity is specified.' },
    { name: '`WARNING`', description: 'Warning severity. Value: `"warning"`.' },
    { name: '`INFORMATION`', description: 'Lowest severity. Value: `"information"`.' },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A simple error dialog with 1 error',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'A simple submit dialog',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
      ],
    },
    {
      expanderTitle: 'Example 3',
      expanderDescription: 'A simple spinner dialog',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
      ],
    },
    {
      expanderTitle: 'Example 4',
      expanderDescription: 'A error dialog with error filtering based on severity level',
      codeSnippets: [
        {
          fileName: 'example-4.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
        {
          fileName: 'example-4.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
      ],
    },
    {
      expanderTitle: 'Example 5',
      expanderDescription: 'An error dialog with multi-line error messages',
      codeSnippets: [
        {
          fileName: 'example-5.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
        {
          fileName: 'example-5.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/message-dialog-service',
        },
      ],
    },
  ];
}
