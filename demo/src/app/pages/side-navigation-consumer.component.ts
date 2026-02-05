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
import { MatButtonModule } from '@angular/material/button';
import { SideNavigationExample1Component } from '../code-snippets/side-navigation/example-1/example-1.component';
import { SideNavigationExample2Component } from '../code-snippets/side-navigation/example-2/example-2.component';
import { SideNavigationExample3Component } from '../code-snippets/side-navigation/example-3/example-3.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-side-navigation-consumer',
  standalone: true,
  imports: [
    SideNavigationExample1Component,
    SideNavigationExample2Component,
    SideNavigationExample3Component,
    SubsectionTitleComponent,
    OverviewSectionComponent,
    DocTableComponent,
    ExpandableSectionsComponent,
    CodeExampleBoxComponent,
    CodeSnippetBoxComponent,
    MatButtonModule,
  ],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The Side Navigation component provides a wizard-like interface combining a vertical process stepper with dynamic step content. It renders steps in a
          side panel (drawer) and displays the corresponding content component in the main area. The component manages step navigation, validates step
          accessibility via FormControls, and supports flexible action templates for each step.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { SideNavigationComponent } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-side-navigation" />

        <app-subsection-title>Inputs</app-subsection-title>
        <app-doc-table [dataSource]="inputsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Content Projection</app-subsection-title>
        <app-doc-table [dataSource]="contentProjectionDocTableDataSource"></app-doc-table>

        <app-subsection-title>Public Methods</app-subsection-title>
        <app-doc-table [dataSource]="methodsDocTableDataSource"></app-doc-table>

        <app-subsection-title>Helper Types & Functions</app-subsection-title>
        <app-doc-table [dataSource]="helperTypesDocTableDataSource"></app-doc-table>

        <app-subsection-title>Notes</app-subsection-title>
        <ul>
          <li>Step content components must extend <code>StepContentComponent&lt;T&gt;</code> to receive typed input data.</li>
          <li>
            Step content components can inject <code>StepNavigationService</code> to access navigation methods (next, previous, reset) and computed signals
            (canGoToNext, canGoToPrevious).
          </li>
          <li>Use <code>createStepContent()</code> for automatic TypeScript type inference when defining step contents.</li>
          <li>The component uses Angular Material's <code>mat-drawer</code> for the side navigation layout.</li>
          <li>Each step requires a <code>ProcessStep</code> with a FormControl for validation state tracking.</li>
          <li>
            Action templates (buttons, etc.) are defined in the step content component template as <code>&lt;ng-template #actionsLeft&gt;</code> and
            <code>&lt;ng-template #actionsRight&gt;</code>.
          </li>
          <li>The internal stepper validates step accessibility based on FormControl states (valid/invalid/disabled).</li>
        </ul>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-side-navigation-example-1></app-side-navigation-example-1>
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-side-navigation-example-2></app-side-navigation-example-2>
      </app-code-example-box>

      <app-code-example-box [options]="examples[2]">
        <app-side-navigation-example-3></app-side-navigation-example-3>
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class SideNavigationConsumerComponent {
  inputsDocTableDataSource = [
    {
      name: '`sideNavTitle: string`',
      description: 'Required. The title displayed at the top of the side navigation panel.',
    },
    {
      name: '`stepsMap: Map<ProcessStep, StepContent<any>>`',
      description: 'Optional. A map linking ProcessStep definitions to their corresponding StepContent (component, inputData). Defaults to an empty Map.',
    },
  ];

  contentProjectionDocTableDataSource = [
    {
      name: '`sideNavSubtitle`',
      description: 'Optional ng-template for a subtitle or description text displayed below the side navigation title.',
    },
    {
      name: '`additionalSideNavActions`',
      description: 'Optional ng-template for additional actions or controls displayed in the side navigation panel.',
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
      description: 'Resets the stepper to the first step.',
    },
    {
      name: '`canGoToNext()`',
      description: 'Returns a computed signal indicating whether navigation to the next step is allowed.',
    },
    {
      name: '`canGoToPrevious()`',
      description: 'Returns a computed signal indicating whether navigation to the previous step is allowed.',
    },
  ];

  helperTypesDocTableDataSource = [
    {
      name: '`StepNavigationService`',
      description:
        'Abstract service interface that provides navigation methods for step content components. Content components can inject this service to access next(), previous(), reset(), canGoToNext(), and canGoToPrevious(). The SideNavigationComponent implements and provides this service.',
    },
    {
      name: '`StepContent<C>`',
      description: 'Interface defining step content with component and optional inputData. Generic C is the component type for automatic type inference.',
    },
    {
      name: '`StepContentComponent<T>`',
      description:
        'Abstract base class for step content components. Provides an inputData signal of type T for receiving data from the parent, and viewChild references (actionsLeft, actionsRight) for action templates defined in the component template.',
    },
    {
      name: '`createStepContent(content)`',
      description: 'Helper function to create StepContent with automatic TypeScript type inference for inputData based on the component type.',
    },
    {
      name: '`ProcessStep`',
      description: 'Type from ProcessStepper component defining a step with key, label, and FormControl for validation.',
    },
  ];

  cssVariablesDocTableDataSource = [
    {
      name: 'Inherited from ProcessStepper',
      description: 'The component uses the ProcessStepper internally, which defines CSS variables for colors and styling.',
    },
  ];

  examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'Basic 6-step process with simple navigation and input data passing demonstration',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-content-components.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step1-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step2-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step3-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step4-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step5-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
        {
          fileName: 'example-1-step6-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-1',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'Form-based 6-step process with validation, reactive forms and data submission',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-form.service.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-message.service.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-content-components.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step1-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step2-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step3-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step4-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step5-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
        {
          fileName: 'example-2-step6-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-2',
        },
      ],
    },
    {
      expanderTitle: 'Example 3',
      expanderDescription: 'Complex example with ngx-formly, nested FormGroups, conditional step activation and PasteBox integration',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3.step-data.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-content-components.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-notifying-person-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-notified-person-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-disease-choice-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-condition-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-common-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-questionnaire-content.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-message.service.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-notification.service.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
        {
          fileName: 'example-3-field-config.service.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/side-navigation/example-3',
        },
      ],
    },
  ];
}
