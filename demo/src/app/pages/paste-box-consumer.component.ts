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
import { PasteBoxExample1Component } from '../code-snippets/paste-box/example-1.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-paste-box-consumer',
  standalone: true,
  imports: [
    SubsectionTitleComponent,
    OverviewSectionComponent,
    ExpandableSectionsComponent,
    DocTableComponent,
    CodeExampleBoxComponent,
    PasteBoxExample1Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The Paste Box component is used to display a box containing a button that allows the user to paste wellformed text from the clipboard into a DEMIS
          input form. It expects the clipboard content to be in the format described in the following
          <a href="https://wiki.gematik.de/spaces/DSKB/pages/474112380/%C3%9Cbergabe+von+Daten+aus+dem+KIS+PVS+AVS+Prim%C3%A4rsystem" target="_blank">
            <span>DEMIS knowledge base article</span> </a
          >. The value of the clipboard is read and parsed in this component and will be emitted as map structure to the parent component via a
          <code>dataPasted</code> event. The consumer then can use this map to further validate the keys and/or values and fill the input fields of the form,
          respectively.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <pre><code>{{ 'import { PasteBoxComponent } from "@gematik/demis-portal-core-library";' }}</code></pre>

        <app-subsection-title>Selector</app-subsection-title>
        <pre><code>gem-demis-paste-box</code></pre>

        <app-subsection-title>Events</app-subsection-title>
        <app-doc-table [dataSource]="eventsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Used CSS</app-subsection-title>
        <app-doc-table [dataSource]="cssDocTableDataSource"></app-doc-table>

        <app-subsection-title>Material Icon</app-subsection-title>
        <p>The button uses an outlined icon. Make sure, that your consuming app uses the CSS definitions for outlined material icons in some way.</p>

        <app-subsection-title>Example clipboard contents</app-subsection-title>
        <app-doc-table [dataSource]="exampleClipboardContentsDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-paste-box-example-1></app-paste-box-example-1>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class PasteBoxConsumerComponent {
  eventsDocTableDataSource = [
    {
      name: 'dataPasted: EventEmitter<Map<string, string>>()',
      description: 'Emits the parsed value read from the clipboard as Map<string, string>',
      options: { nameIsCode: true },
    },
  ];

  cssDocTableDataSource = [
    { name: '--color-primary', description: 'Color variable used as text color for the title of the paste box', options: { nameIsCode: true } },
  ];

  exampleClipboardContentsDocTableDataSource = [
    {
      name: 'URL P.family=Schulz&P.given=Klaus',
      description: 'Can be parsed an will set the given name and family name for a person',
      options: { nameIsCode: true },
    },
    { name: 'P.family=Schulz&P.given=Klaus', description: 'Cannot be parsed, because of the missing prefix', options: { nameIsCode: true } },
    {
      name: 'JSON {"P.family":"Schulz","P.given":"Klaus"}',
      description: 'Cannot be parsed, because the parser only understands URL format',
      options: { nameIsCode: true },
    },
    { name: 'Klaus Schulz', description: 'Cannot be parsed, because this is no structured data at all', options: { nameIsCode: true } },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A simple Paste Box that reads the clipboard and alerts the value.',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/paste-box',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/paste-box',
        },
      ],
    },
  ];
}
