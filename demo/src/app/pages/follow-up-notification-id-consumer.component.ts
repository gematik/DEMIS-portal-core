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
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent, DocTableRowData } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { FollowUpNotificationIdExample1Component } from '../code-snippets/follow-up-notification-id/example-1.component';

@Component({
  selector: 'app-follow-up-notification-id',
  imports: [
    OverviewSectionComponent,
    SubsectionTitleComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    FollowUpNotificationIdExample1Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The follow up notification id service provides a dialog and logic for showing follow up specific dialog that can be configured for different
          notification types. It includes an input field for the notificationId. The notificationId is validated by checking if is stored in a database (i.e.
          via DLS) and if it is the right notification type (§7.1, 6.1, or §7.3). The input field reacts to the validation and shows errors or success states
          accordingly.
        </p>

        <p>See the examples below for the different ways to use the follow up notification id service.</p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { FollowUpNotificationIdService } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Readonly Variables</app-subsection-title>
        <app-doc-table [dataSource]="readonlyVariablesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Enum ValidationStatus</app-subsection-title>
        <app-doc-table [dataSource]="validationStatusDocTableDataSource"></app-doc-table>

        <app-subsection-title>Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource"></app-doc-table>

        <app-subsection-title>openDialog - Parameters</app-subsection-title>
        <app-doc-table [dataSource]="openDialogDocTableDataSource"></app-doc-table>

        <app-subsection-title>Interface FollowUpServiceDialogData - Properties</app-subsection-title>
        <app-doc-table [dataSource]="followUpServiceDialogDataDocTableDataSource"></app-doc-table>

        <app-subsection-title>Interface FollowUpDialogData - Properties</app-subsection-title>
        <app-doc-table [dataSource]="followUpDialogDataDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-follow-up-notification-id-example-1></app-follow-up-notification-id-example-1>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FollowUpNotificationIdConsumerComponent {
  methodsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`openDialog`',
      description: ['Opens the follow up notification id dialog.', 'Subscribes to closing the dialog and sets the validation status accordingly.'],
    },
    {
      name: '`closeDialog`',
      description: ['Closes the dialog'],
    },
    {
      name: '`validateNotificationId`',
      description: [
        'Checks if the entered notificationId is stored in database by calling configured backend service via FhirCoreNotificationService.',
        'Checks if the entered notificationId is in the list of supported notificationCategories.',
        'Returns an error if one of the above checks fail.',
        'Sets validationStatus, notificationId, and followUpNotificationCategory.',
      ],
    },
    {
      name: '`resetState`',
      description: ['Sets validatedNotificationId and validationStatus to their original state.'],
    },
  ];

  readonlyVariablesDocTableDataSource: DocTableRowData[] = [
    {
      name: '`validatedNotificationId: WriteableSignal<string | undefined>`',
      description: ['Notification Id that was validated by the service and is valid.'],
    },
    {
      name: '`validationStatus: WriteableSignal<ValidationStatus>`',
      description: ['Status of the notificationId that was entered into the input field of the dialog'],
    },
    {
      name: '`hasValidNotificationId: WriteableSignal<boolean | undefined>`',
      description: ['Boolean value that states if the entered notificationId is valid.'],
    },
    {
      name: '`followUpNotificationCategory: WriteableSignal<string | undefined>`',
      description: ['Notification category which is returned by backend service and is valid.'],
    },
    {
      name: '`hasValidNotificationId$: Observable<boolean | undefined>`',
      description: ['Boolean value that states if the entered notificationId is valid.'],
    },
  ];

  validationStatusDocTableDataSource: DocTableRowData[] = [
    {
      name: '`VALID`',
      description: ['Notification Id is found in backend service (i.e. DLS). Returned NotificationCategory is supported by calling service.'],
    },
    {
      name: '`NOT_FOUND`',
      description: ['Notification Id was not found in backend service.'],
    },
    {
      name: '`NOT_VALIDATED`',
      description: ['NotificationId entered to input field was not yet validated.'],
    },
    {
      name: '`UNSUPPORTED_NOTIFICATION_CATEGORY`',
      description: ['Notification category was found in backend service but is not supported by calling service.'],
    },
  ];

  openDialogDocTableDataSource: DocTableRowData[] = [
    {
      name: '`FollowupDialogData`',
      description: ['Data object containing the parameters for the service and dialog.'],
    },
  ];

  followUpServiceDialogDataDocTableDataSource: DocTableRowData[] = [
    {
      name: '`dialogData: FollowUpDialogData`',
      description: ['Data object containing the parameters for the dialog.'],
    },
    {
      name: '`notificationCategoryCodes?: string[]`',
      description: ['`[optional]` All notification category codes for a notification type (e.g. §7.1 IfSG).'],
    },
  ];

  followUpDialogDataDocTableDataSource: DocTableRowData[] = [
    {
      name: '`routerLink:string`',
      description: ['Link where user is redirected for a nominal notification.'],
    },
    {
      name: '`linkTextContent:string`',
      description: ['Text that is shown for the router link.'],
    },
    {
      name: '`pathToDestinationLookup:string`',
      description: ['Absolute path to destination lookup service depending on environment.'],
    },
    {
      name: '`errorUnsupportedNotificationCategory?:string`',
      description: ['`[optional]`Error message in case that notificationCategory from id does not match notificationCategories'],
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A follow up dialog with only negative validation',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/follow-up-notification-id',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/follow-up-notification-id',
        },
      ],
    },
  ];
}
