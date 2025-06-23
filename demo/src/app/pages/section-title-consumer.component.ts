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
import { SectionTitleExample1Component } from '../code-snippets/section-title/example-1.component';
import { SectionTitleExample2Component } from '../code-snippets/section-title/example-2.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-section-title-consumer',
  standalone: true,
  imports: [
    SectionTitleExample1Component,
    SectionTitleExample2Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
  ],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          In order to display section titles with optional descriptions, there is a Section Title Component. This component is responsible for depicting titles
          with a common appearance throughout the whole application.
        </p>

        <p>See the examples below for the different ways to use the section title component.</p>

        <app-subsection-title>Import</app-subsection-title>
        <pre><code>{{ 'import { SectionTitleComponent } from "@gematik/demis-portal-core-library";' }}</code></pre>

        <app-subsection-title>Selector</app-subsection-title>
        <pre><code>gem-demis-section-title</code></pre>

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Subtitle contents</app-subsection-title>
        <p>Use Angular content projection to insert some HTML template code to be rendered as subtitle contents. This is optional.</p>

        <app-subsection-title>Used CSS variables</app-subsection-title>
        <app-doc-table [dataSource]="cssVariablesDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-section-title-example-1></app-section-title-example-1>
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-section-title-example-2></app-section-title-example-2>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class SectionTitleConsumerComponent {
  propertiesDocTableDataSource = [
    { name: 'titleText', description: '[required] The title text of the section title', options: { nameIsCode: true } },
    { name: 'level', description: '[optional] The level of the section title. 1 or 2. Default is 1', options: { nameIsCode: true } },
  ];
  cssVariablesDocTableDataSource = [
    { name: '--gem-demis-primary-color', description: 'Used as text color for the title text', options: { nameIsCode: true } },
    { name: '--gem-demis-border-color', description: 'Used as text color for the subtitle text', options: { nameIsCode: true } },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A section title in level 1 (default) with some paragraph as description',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/section-title',
        },
      ],
      rowHeight: '300px',
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'A section title in level 2 with some paragraph as description',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/section-title',
        },
      ],
      rowHeight: '300px',
    },
  ];
}
