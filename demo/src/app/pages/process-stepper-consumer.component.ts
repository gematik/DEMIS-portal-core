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
import { StepperExample1Component } from '../code-snippets/process-stepper/example-1.component';
import { StepperExample2Component } from '../code-snippets/process-stepper/example-2.component';

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
          navigation. It provides built-in navigation methods and computed signals for controlling step flow. Domain rules and step accessibility are provided
          by the consumer via inputs (AbstractControl states).
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { DemisProcessStepperComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-process-stepper" />

        <app-subsection-title>Inputs</app-subsection-title>
        <app-doc-table [dataSource]="inputsDocTableDataSource" />

        <app-subsection-title>Types used by inputs</app-subsection-title>
        <app-code-snippet-box codeSnippetPath="code-snippets/process-stepper/process-step.snippet.ts" language="ts" />

        <app-subsection-title>Outputs</app-subsection-title>
        <app-doc-table [dataSource]="outputsDocTableDataSource" />

        <app-subsection-title>Types used by outputs</app-subsection-title>
        <app-code-snippet-box codeSnippetPath="code-snippets/process-stepper/step-change-event.snippet.ts" language="ts" />

        <app-subsection-title>Navigation Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource" />

        <app-subsection-title>Computed Signals</app-subsection-title>
        <app-doc-table [dataSource]="computedSignalsDocTableDataSource" />

        <app-subsection-title>Used CSS</app-subsection-title>
        <app-doc-table [dataSource]="cssDocTableDataSource" />

        <app-subsection-title>Notes</app-subsection-title>
        <ul>
          <li>Use <code>stepChange</code> output or navigation methods (<code>next()</code>, <code>previous()</code>, etc.) to control step flow.</li>
          <li>Call <code>reset()</code> to restore all step controls to their initial enabled/disabled and value state.</li>
          <li>Disabled steps preserve their visual completed/error state from before being disabled.</li>
          <li>Icons rely on Angular Material. Ensure your theme includes Material icon styling.</li>
        </ul>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-stepper-example-1 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-stepper-example-2 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class StepperConsumerComponent {
  inputsDocTableDataSource = [
    {
      name: '`steps: ProcessStep[]`',
      description: 'InputSignal of an array of steps. Each step must carry an AbstractControl instance to reflect completed/error/disabled states.',
    },
    {
      name: '`initStepIndex: number`',
      description: 'Zero-based index of the initially active step.',
    },
  ];

  methodsDocTableDataSource = [
    {
      name: '`next()`',
      description: 'Navigates to the next step if possible.',
    },
    {
      name: '`previous()`',
      description: 'Navigates to the previous step if possible.',
    },
    {
      name: '`reset()`',
      description: 'Resets the stepper to its initial state, restoring all step controls to their initial enabled/disabled and value state.',
    },
    {
      name: '`goToStep(index)`',
      description: 'Navigates directly to the step at the given zero-based index. Does nothing if the index is out of bounds or the target step is disabled.',
    },
    {
      name: '`goToStepByKey(key)`',
      description: 'Navigates directly to the step with the given unique key. Does nothing if the key is not found or the target step is disabled.',
    },
  ];

  computedSignalsDocTableDataSource = [
    {
      name: '`canGoToNext`',
      description: 'Computed signal indicating whether navigation to the next step is allowed (next step exists and is not disabled).',
    },
    {
      name: '`canGoToPrevious`',
      description: 'Computed signal indicating whether navigation to the previous step is allowed (previous step exists and is not disabled).',
    },
    {
      name: '`currentStepIndex`',
      description: 'Signal returning the zero-based index of the currently active step.',
    },
    {
      name: '`currentStep`',
      description: 'Computed signal returning the currently active ProcessStep, or undefined if the index is out of bounds.',
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
      name: '`--color-primary`',
      description: 'Primary color used for active step icons, labels, borders, and selected state backgrounds. Defined in portal-theme.',
    },
    {
      name: '`--color-neutral-light`',
      description: 'Neutral color used for the vertical line, separators, and disabled step icons/labels. Defined in portal-theme.',
    },
    {
      name: '`--color-white`',
      description: 'Background color for step icons. Defined in portal-theme.',
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
          codeSnippetPath: 'code-snippets/process-stepper',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/process-stepper',
        },
        {
          fileName: 'example-1.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/process-stepper',
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
          codeSnippetPath: 'code-snippets/process-stepper',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/process-stepper',
        },
        {
          fileName: 'example-2.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/process-stepper',
        },
      ],
    },
  ];
}
