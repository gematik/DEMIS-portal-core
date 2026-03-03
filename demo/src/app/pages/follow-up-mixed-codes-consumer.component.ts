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
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { FollowUpMixedCodesExample1Component } from '../code-snippets/follow-up-mixed-codes/example-1.component';

@Component({
  selector: 'app-follow-up-mixed-codes-consumer',
  standalone: true,
  imports: [
    FollowUpMixedCodesExample1Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
  ],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The follow up mixed codes dialog lets users choose between multiple follow up notification categories when a follow up without personal data is
          required. The dialog presents radio options and returns the selected code to the caller when the user continues.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { FollowUpMixedCodesComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-follow-up-mixed-codes" />

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource" />

        <app-subsection-title>Useful further information</app-subsection-title>
        <p>
          The dialog template expects two entries in the mixed codes list (indexes 0 and 1). Provide exactly two items to the service or update the template if
          more options are needed. Closing the dialog returns the selected code, or undefined when the dialog is dismissed.
        </p>

        <app-subsection-title>Used CSS variables</app-subsection-title>
        <app-doc-table [dataSource]="cssVariablesDocTableDataSource" />
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-follow-up-mixed-codes-example-1 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FollowUpMixedCodesConsumerComponent {
  propertiesDocTableDataSource = [
    { name: '`mixedCodesList: customCodeDisplay[]`', description: 'List of mixed follow up codes provided via MAT_DIALOG_DATA.' },
    { name: '`selectedValue: WritableSignal<string | undefined>`', description: 'Currently selected code from the radio group.' },
    { name: '`nextButtonDisabled: Signal<boolean>`', description: 'Derived state; true until a selection is made.' },
  ];

  cssVariablesDocTableDataSource = [
    { name: '`--mat-radio-label-text-size`', description: 'Controls the label font size for the radio options inside the dialog.' },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Open the dialog and return the selected mixed code.',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/follow-up-mixed-codes',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/follow-up-mixed-codes',
        },
      ],
    },
  ];
}
