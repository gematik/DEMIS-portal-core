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
import { MarkdownExample1Component } from '../code-snippets/markdown-service/example-1.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent, DocTableRowData } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-markdown-consumer',
  imports: [
    MarkdownExample1Component,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    OverviewSectionComponent,
    SubsectionTitleComponent,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          MarkdownService synchronously converts Markdown to an HTML string using marked and sanitizes the result with Angular's DomSanitizer in the HTML
          security context.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { MarkdownService } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Injection</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString="private readonly markdownService = inject(MarkdownService);" />
        <p>The service is provided in root. No additional providers or configuration are required.</p>

        <app-subsection-title>Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource" />

        <app-subsection-title>Rendering and security</app-subsection-title>
        <p>
          Bind the returned string with Angular's innerHTML property binding. Do not use bypassSecurityTrustHtml: sanitization removes unsafe HTML, including
          scripts and event-handler attributes. The result is a string, not SafeHtml. Angular bindings and components inside the generated HTML are not
          compiled.
        </p>
        <p>
          Use a computed signal to update the HTML when the Markdown changes, instead of parsing it on every change-detection pass. Markdown supports headings,
          emphasis, lists, links and code blocks; their appearance depends on the application's styles.
        </p>
      </app-overview-section>

      <app-code-example-box [options]="example">
        <app-markdown-example-1 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class MarkdownConsumerComponent {
  readonly methodsDocTableDataSource: DocTableRowData[] = [
    {
      name: '`convertToSanitizedHtml(markdown: string): string`',
      description: 'Parses the supplied Markdown synchronously and returns sanitized HTML. An empty input produces an empty string.',
    },
  ];

  readonly example: CodeExampleBoxComponentOptions = {
    expanderTitle: 'Example 1',
    expanderDescription: 'Markdown conversion and HTML sanitization',
    codeSnippets: [
      { fileName: 'example-1.component.html', language: 'html', codeSnippetPath: 'code-snippets/markdown-service' },
      { fileName: 'example-1.component.ts', language: 'ts', codeSnippetPath: 'code-snippets/markdown-service' },
    ],
  };
}
