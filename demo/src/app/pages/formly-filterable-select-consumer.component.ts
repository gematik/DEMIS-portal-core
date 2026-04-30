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
import { RouterLink } from '@angular/router';
import { FilterableSelectExample1Component } from '../code-snippets/formly-filterable-select/example-1.component';
import { FilterableSelectExample2Component } from '../code-snippets/formly-filterable-select/example-2.component';
import { FilterableSelectExample3Component } from '../code-snippets/formly-filterable-select/example-3.component';
import { FilterableSelectExample4Component } from '../code-snippets/formly-filterable-select/example-4.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-formly-filterable-select-consumer',
  standalone: true,
  imports: [
    FilterableSelectExample1Component,
    FilterableSelectExample2Component,
    FilterableSelectExample3Component,
    FilterableSelectExample4Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    RouterLink,
  ],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The Formly Filterable Select component is a custom Formly type that provides a searchable dropdown based on Angular Material's
          <code>mat-select</code> with integrated <code>ngx-mat-select-search</code> for filtering. In multi-select mode, selected values are displayed as chips
          above the select field.
        </p>

        <app-subsection-title>Architecture</app-subsection-title>
        <p>
          The component binds <code>mat-select</code> directly to Formly's <code>formControl</code>, ensuring seamless form state synchronization. The search
          input is a separate, local <code>FormControl</code> used exclusively for filtering — never for value binding.
        </p>

        <app-subsection-title>Generic object support</app-subsection-title>
        <p>
          The component accepts any object array as options. Use <code>valueKey</code>, <code>labelKey</code>, and <code>descriptionKey</code> to map your
          domain objects. Defaults are <code>value</code>, <code>label</code>, and <code>description</code> matching the <code>SelectOption</code> interface.
        </p>

        <app-subsection-title>Type-safe builder</app-subsection-title>
        <p>
          For full compile-time safety, use the <code>filterableSelectField&lt;T&gt;()</code> builder function instead of plain
          <code>FormlyFieldConfig</code> objects. The builder infers the option type from the <code>options</code> array: when using <code>SelectOption</code>,
          no key mapping is needed. For any other type, TypeScript requires <code>valueKey</code> and <code>labelKey</code> and validates them via
          <code>keyof T</code> — including editor autocompletion. See Example 4 below.
        </p>

        <app-subsection-title>Use the custom type in your project</app-subsection-title>
        <p>
          Register the component as a custom Formly type in your Formly config. The type name <code>filterable-select</code> supports both single and
          multi-select via the <code>multiple</code> property. For an example of how to configure custom types in general, see
          <a routerLink="/formly/repeater">this example</a>.
        </p>

        <app-subsection-title>Properties</app-subsection-title>
        <app-doc-table [dataSource]="propertiesDocTableDataSource" />

        <app-subsection-title>SelectOption Interface</app-subsection-title>
        <app-doc-table [dataSource]="selectOptionDocTableDataSource" />
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-filterable-select-example-1 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[1]">
        <app-filterable-select-example-2 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[2]">
        <app-filterable-select-example-3 />
      </app-code-example-box>
      <app-code-example-box [options]="examples[3]">
        <app-filterable-select-example-4 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class FormlyFilterableSelectConsumerComponent {
  propertiesDocTableDataSource = [
    {
      name: '`options`',
      description: [
        '`[required]` Array of option objects. Can be `SelectOption[]` or any domain object array.',
        'When using custom objects, configure `valueKey`, `labelKey`, and `descriptionKey`.',
      ],
    },
    {
      name: '`optionValueKey`',
      description: ['`[optional]` Property name for the unique identifier on each option object. Defaults to `"value"`.'],
    },
    {
      name: '`optionLabelKey`',
      description: ['`[optional]` Property name for the display text on each option object. Defaults to `"label"`.'],
    },
    {
      name: '`optionDescriptionKey`',
      description: ['`[optional]` Property name for additional context on each option object. Defaults to `"description"`.'],
    },
    {
      name: '`multiple`',
      description: [
        '`[optional]` Defaults to false. If true, enables multi-selection mode.',
        'In multi-select mode, selected values are displayed as removable chips above the select field.',
      ],
    },
    {
      name: '`showValue`',
      description: [
        '`[optional]` Defaults to false. If true, displays the option value alongside the label.',
        'Format: "Label | VALUE". Also enables value-based search filtering.',
      ],
    },
    {
      name: '`clearable`',
      description: ['`[optional]` Defaults to true. If true, shows a clear button when a value is selected.'],
    },
    {
      name: '`searchPlaceholder`',
      description: ['`[optional]` Placeholder text for the search input inside the dropdown panel. Defaults to "Suchen...".'],
    },
    {
      name: '`noEntriesFoundLabel`',
      description: ['`[optional]` Text displayed when no options match the search query. Defaults to "Keine Einträge gefunden".'],
    },
  ];

  selectOptionDocTableDataSource = [
    {
      name: '`value`',
      description: ['`[required]` Unique identifier for the option.'],
    },
    {
      name: '`label`',
      description: ['`[required]` Human-readable text displayed to the user.'],
    },
    {
      name: '`description`',
      description: [
        '`[optional]` Additional context displayed alongside the option (e.g. hierarchy or category path).',
        'Also shown in muted style next to the selected value in the closed select trigger (single-select only).',
      ],
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Beispiel 1',
      expanderDescription: 'Einzelauswahl mit Suche (Meldetatbestand)',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
      ],
    },
    {
      expanderTitle: 'Beispiel 2',
      expanderDescription: 'Mehrfachauswahl mit Chips',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
      ],
    },
    {
      expanderTitle: 'Beispiel 3',
      expanderDescription: 'Einzelauswahl mit Wertanzeige und Beschreibungen',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
      ],
    },
    {
      expanderTitle: 'Beispiel 4',
      expanderDescription: 'Type-safe Builder mit Domain-Objekten',
      codeSnippets: [
        {
          fileName: 'example-4.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
        {
          fileName: 'example-4.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/formly-filterable-select',
        },
      ],
    },
  ];
}
