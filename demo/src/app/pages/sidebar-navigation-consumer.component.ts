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
import { StepperExample1Component } from '../code-snippets/sidebar-navigation/example-1.component';
import { StepperExample2Component } from '../code-snippets/sidebar-navigation/example-2.component';

@Component({
  selector: 'app-stepper-consumer',
  standalone: true,
  imports: [
    SubsectionTitleComponent,
    OverviewSectionComponent,
    ExpandableSectionsComponent,
    DocTableComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    StepperExample1Component,
    StepperExample2Component,
  ],
  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The Process Stepper component displays a vertical list of steps with visual states (completed, error, disabled, default) and supports keyboard
          navigation. It is presentation-only: domain rules and step accessibility are provided by the consumer via inputs.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { DemisProcessStepperComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-process-stepper" />

        <app-subsection-title>Inputs</app-subsection-title>
        <app-doc-table [dataSource]="inputsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Types used by inputs</app-subsection-title>
        <app-code-snippet-box codeSnippetPath="code-snippets/sidebar-navigation/process-step.snippet.ts" language="ts" />

        <app-subsection-title>Outputs</app-subsection-title>
        <app-doc-table [dataSource]="outputsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Types used by outputs</app-subsection-title>
        <app-code-snippet-box codeSnippetPath="code-snippets/sidebar-navigation/step-change-event.snippet.ts" language="ts" />

        <app-subsection-title>Used CSS</app-subsection-title>
        <app-doc-table [dataSource]="cssDocTableDataSource"></app-doc-table>

        <app-subsection-title>Notes</app-subsection-title>
        <ul>
          <li>Use your app/router to react to <code>stepChange</code> and update fragments or state.</li>
          <li>Icons rely on Angular Material. Ensure your theme includes Material icon styling.</li>
        </ul>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-stepper-example-1></app-stepper-example-1>
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-stepper-example-2></app-stepper-example-2>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class StepperConsumerComponent {
  inputsDocTableDataSource = [
    {
      name: '`steps: ProcessStep[]`',
      description:
        'InputSignal of an array of steps. Each step must carry a (Formly-backed) AbstractControl instance to reflect completed/error/disabled states.',
    },
    {
      name: '`initStepIndex: number`',
      description: 'Zero-based index of the initially active step.',
    },
  ];

  outputsDocTableDataSource = [
    {
      name: '`stepChange: EventEmitter<StepChangeEvent>`',
      description: 'Emits when the user selects a different step. Consumer can update router fragments/state.',
    },
  ];

  cssDocTableDataSource = [
    {
      name: '`--gem-color-border-neutral`',
      description: 'Border color used for the vertical line and separators.',
    },
    {
      name: '`--gem-color-primary-700`',
      description: 'Primary color used for active icons/texts.',
    },
    {
      name: '`--gem-color-danger-600`',
      description: 'Color used for error state icons.',
    },
    {
      name: '`--gem-color-success-600`',
      description: 'Color used for completed state icons.',
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'A simple stepper with completed/error/disabled states.',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
        {
          fileName: 'example-1.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'A linear stepper implementation, that restricts navigation until all previous steps are complete.',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
        {
          fileName: 'example-2.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/sidebar-navigation',
        },
      ],
    },
  ];
}
