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
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { FormsFooterExample1Component } from '../code-snippets/forms-footer/example-1.component';

@Component({
  selector: 'app-forms-footer-consumer',
  standalone: true,
  imports: [
    FormsFooterExample1Component,
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
          This forms footer component is used to display standardized legal and organizational links in each forms page, displayed on the bottom of the page
          inside the sidebar-navigation.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { FormsFooterComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-forms-footer" />

        <app-subsection-title>Useful further information</app-subsection-title>
        <p>
          This component is accessible, using a semantic navigation structure and is focus-capable. The footer uses a responsive design where the links break
          and arrange vertically on smaller screens.
        </p>
        <app-subsection-title>Used CSS variables</app-subsection-title>
        <app-doc-table [dataSource]="cssVariablesDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-forms-footer-example-1></app-forms-footer-example-1>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FormsFooterConsumerComponent {
  propertiesDocTableDataSource = [];

  cssVariablesDocTableDataSource = [
    {
      name: '`--color-neutral-light`',
      description: 'Color for divider lines.',
    },
    {
      name: '`--color-primary`',
      description: 'Text and focus color for links.',
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Displays forms footer.',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/forms-footer',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/forms-footer',
        },
      ],
    },
  ];
}
