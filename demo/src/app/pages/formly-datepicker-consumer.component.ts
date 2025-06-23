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
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';
import { FormlyDatepickerExample1Component } from '../code-snippets/formly-datepicker/example-1.component';
import { RouterLink } from '@angular/router';
import { FormlyDatepickerExample2Component } from '../code-snippets/formly-datepicker/example-2.component';
import { FormlyRepeaterExample2Component } from '../code-snippets/formly-repeater/example-2.component';
import { FormlyDatepickerExample3Component } from '../code-snippets/formly-datepicker/example-3.component';

@Component({
  selector: 'app-formly-datepicker-consumer',
  standalone: true,
  imports: [
    FormlyDatepickerExample1Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    RouterLink,
    FormlyDatepickerExample2Component,
    FormlyRepeaterExample2Component,
    FormlyDatepickerExample3Component,
  ],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>The Formly Datepicker component is a custom Formly type that provides a configurable and enhanced datepicker based on Angular Material.</p>

        <app-subsection-title>Use the custom type in your project</app-subsection-title>
        <p>
          You need to import the Formly Datepicker component and bind it to the custom type declared in your Formly config. For an example of how to configure
          custom types in general, see
          <a routerLink="/components/formly-repeater">this example</a>.
        </p>

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Used CSS variables</app-subsection-title>
        <app-doc-table [dataSource]="cssVariablesDocTableDataSource"></app-doc-table>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-formly-datepicker-example-1></app-formly-datepicker-example-1>
      </app-code-example-box>
      <app-code-example-box [options]="examples[1]">
        <app-formly-datepicker-example-2></app-formly-datepicker-example-2>
      </app-code-example-box>
      <app-code-example-box [options]="examples[2]">
        <app-formly-datepicker-example-3></app-formly-datepicker-example-3>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FormlyDatepickerConsumerComponent {
  propertiesDocTableDataSource = [
    {
      name: 'allowedPrecisions',
      description:
        '[optional] Specifies which date precisions the datepicker supports. Allowed values are: "day" (e.g. 25.12.2023), "month" (e.g. 12.2023), "year" (e.g. 2023). Defaults to ["day"] if not provided.',
      options: { nameIsCode: true },
    },
    {
      name: 'minDate',
      description:
        "[optional] The minimum valid date (as a Date object, e.g., `new Date('2020-01-01')`). The standard validation message can be overridden in the Formly config by providing a custom message in `validation: { messages: { minDate: 'your custom message' } }`.",
      options: { nameIsCode: true },
    },
    {
      name: 'maxDate',
      description:
        "[optional] The maximum valid date (as a Date object, e.g., `new Date('2020-01-01')`). The standard validation message can be overridden in the Formly config by providing a custom message in `validation: { messages: { maxDate: 'your custom message' } }`.",
      options: { nameIsCode: true },
    },
    {
      name: 'multiYear',
      description:
        '[optional] If true, the datepicker will opens in a multi-year view for both day and month precision. This is mostly useful for fields where you expected the user to navigate through multiple years, like a birth date. This significantly improves the user experience for such fields. On the contrary, not very useful if you expect the user to select a date near to the present. Defaults to false.',
      options: { nameIsCode: true },
    },
  ];
  cssVariablesDocTableDataSource = [
    { name: '--color-primary', description: 'Color variable used for the toggle icon and in the header', options: { nameIsCode: true } },
    { name: '--color-secondary-dark20', description: 'Color variable used as background', options: { nameIsCode: true } },
    { name: '--color-neutral-dark', description: 'Color variable used in the header', options: { nameIsCode: true } },
    { name: '--color-neutral-light', description: 'Color variable used in the header', options: { nameIsCode: true } },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Basic datepicker with date range',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'Datepicker with multi-years view for both day and month precision',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
      ],
    },
    {
      expanderTitle: 'Example 3',
      expanderDescription: 'Dynamic date range ',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-datepicker',
        },
      ],
    },
  ];
  declareDateImplementation = `import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';

providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: de },
]`;
}
