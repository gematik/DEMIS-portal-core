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
import { SectionHeaderExample2Component } from '../code-snippets/section-header/example-2.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { SectionHeaderExample1Component } from '../code-snippets/section-header/example-1.component';
import { SectionHeaderExample3Component } from '../code-snippets/section-header/example-3.component';

@Component({
  selector: 'app-section-header-consumer',
  imports: [
    SectionHeaderExample2Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    SectionHeaderExample1Component,
    SectionHeaderExample3Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          In order to display section headers with optional descriptions, there is a Section Header Component. This component is responsible for depicting
          headers with a common appearance throughout the whole application.
        </p>

        <p>See the examples below for the different ways to use the section header component.</p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { SectionHeaderComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-section-header" />

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource" />

        <app-subsection-title>Subtitle contents</app-subsection-title>
        <p>Use Angular content projection to insert some HTML template code to be rendered as subtitle contents. This is optional.</p>

        <app-subsection-title>Heading ID</app-subsection-title>
        <p>
          Bind [id] to set the ID of the rendered h1 or h2, not the component host. Other elements can reference this heading using aria-labelledby. Use a
          unique ID for each heading. Binding [attr.id] on the component sets only the host attribute and does not populate the id input.
        </p>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-section-header-example-1 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-section-header-example-2 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[2]">
        <app-section-header-example-3 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class SectionHeaderConsumerComponent {
  propertiesDocTableDataSource = [
    {
      name: '`level`',
      description: '`[optional]` Heading level: 1 renders an h1, 2 renders an h2. Default: 2. Both levels use the same title typography.',
    },
    { name: '`titleText`', description: '`[required]` The visible title text.' },
    {
      name: '`id`',
      description: '`[optional]` string | null. Sets the ID of the inner h1 or h2. Default: null (no heading ID attribute).',
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1 — Page title',
      expanderDescription: 'Render the main page title. Use exactly once per page.',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/section-header',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/section-header',
        },
      ],
    },
    {
      expanderTitle: 'Example 2 — Section title with subtitle',
      expanderDescription: 'Render a section title and add an optional subtitle via content projection.',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/section-header',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/section-header',
        },
      ],
    },
    {
      expanderTitle: 'Example 3 - Heading ID',
      expanderDescription: 'Set the heading ID through the component input and reference it as the accessible name of a section.',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/section-header',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/section-header',
        },
      ],
    },
  ];
}
