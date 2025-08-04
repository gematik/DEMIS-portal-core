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
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { <%= classNamePrefix %>Example1Component } from '../code-snippets/<%= selectorSuffix %>/example-1.component';

@Component({
  selector: 'app-<%= selectorSuffix %>-consumer',
  standalone: true,
  imports: [
    <%= classNamePrefix %>Example1Component,
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
          Tell some description about the component in here.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { <%= classNamePrefix %>Component } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-<%= selectorSuffix %>" />

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Useful further information</app-subsection-title>
        <p>Name some useful information a potential developer should be aware of when using <%= classNamePrefix %>Component</p>

        <app-subsection-title>Used CSS variables</app-subsection-title>
        <app-doc-table [dataSource]="cssVariablesDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-<%= selectorSuffix %>-example-1></app-<%= selectorSuffix %>-example-1>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class <%= consumerComponentName %>Component {
  propertiesDocTableDataSource = [
    { name: '`property`', description: 'Tell something about the property' },
  ];

  cssVariablesDocTableDataSource = [
    { name: '`css variable`', description: 'Tell something about this css variable, especially for what it is used' },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Describe the use case depicted in this example',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/<%= selectorSuffix %>',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/<%= selectorSuffix %>',
        },
      ],
    },
  ];
}
