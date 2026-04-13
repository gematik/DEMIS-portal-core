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

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- SideNavigationComponent                                    -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <app-subsection-title>SideNavigationComponent</app-subsection-title>
        <p>
          The main component that renders the side panel with the stepper and the dynamic content area. Uses Angular Material's <code>mat-drawer</code> for the
          layout.
        </p>

        <app-code-snippet-box language="ts" codeSnippetString='import { SideNavigationComponent } from "@gematik/demis-portal-core-library";' />
        <app-code-snippet-box language="html" codeSnippetString="gem-demis-side-navigation" />

        <app-doc-table title="Inputs" [dataSource]="componentInputsDocTableDataSource" />
        <app-doc-table title="Content Projection" [dataSource]="contentProjectionDocTableDataSource" />

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- StepNavigation                                             -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <app-subsection-title>StepNavigation</app-subsection-title>
        <p>
          Abstract navigation interface for controlling step navigation. The host component must call
          <code>provideStepNavigation()</code> in its <code>providers</code> array. The <code>SideNavigationComponent</code> registers its internal stepper
          automatically. Both host and step content components inject <code>StepNavigation</code>.
        </p>

        <app-code-snippet-box language="ts" codeSnippetString='import { StepNavigation, provideStepNavigation } from "@gematik/demis-portal-core-library";' />
        <app-code-snippet-box language="ts" codeSnippetString="providers: [provideStepNavigation()]" />

        <app-doc-table title="Methods" [dataSource]="navigationMethodsDocTableDataSource" />
        <app-doc-table title="Computed Signals" [dataSource]="navigationSignalsDocTableDataSource" />

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- Step Content Development                                   -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <app-subsection-title>Step Content Development</app-subsection-title>
        <p>
          Each step's content is rendered as a dynamically created component. Step content components must extend
          <code>StepContentComponent&lt;T&gt;</code> to receive typed input data and to expose action templates. Inject <code>StepNavigation</code> for
          navigation controls.
        </p>

        <app-code-snippet-box
          language="ts"
          codeSnippetString='import { StepContentComponent, StepContent, createStepContent, ProcessStep, StepNavigation } from "@gematik/demis-portal-core-library";' />

        <app-code-snippet-box
          language="ts"
          codeSnippetString="export class MyStepContentComponent extends StepContentComponent<void> {
  protected navigation = inject(StepNavigation);
}" />

        <app-doc-table title="Types & Helpers" [dataSource]="stepContentDocTableDataSource" />

        <app-subsection-title>Notes</app-subsection-title>
        <ul>
          <li>
            The host component must call <code>provideStepNavigation()</code> in its <code>providers</code> array. This sets up the navigation service and the
            abstract <code>StepNavigation</code> token automatically.
          </li>
          <li>Each step requires a <code>ProcessStep</code> with an <code>AbstractControl</code> for validation state tracking (valid/invalid/disabled).</li>
          <li>
            Action templates (buttons, etc.) are defined in the step content component template as <code>&lt;ng-template #actionsLeft&gt;</code> and
            <code>&lt;ng-template #actionsRight&gt;</code>. They are rendered in the footer area below the main content.
          </li>
          <li>Use <code>createStepContent()</code> for automatic TypeScript type inference when defining step contents.</li>
          <li>Disabled steps preserve their visual completed/error state from before being disabled.</li>
        </ul>
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-side-navigation-example-1 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-side-navigation-example-2 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[2]">
        <app-side-navigation-example-3 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class SideNavigationConsumerComponent {
  // ── SideNavigationComponent ──────────────────────────────────────

  componentInputsDocTableDataSource = [
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

  // ── StepNavigation ────────────────────────────────────────

  navigationMethodsDocTableDataSource = [
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
      description: 'Resets the stepper to the first step and restores all controls to their initial state.',
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

  navigationSignalsDocTableDataSource = [
    {
      name: '`canGoToNext()`',
      description: 'Computed signal indicating whether navigation to the next step is allowed.',
    },
    {
      name: '`canGoToPrevious()`',
      description: 'Computed signal indicating whether navigation to the previous step is allowed.',
    },
    {
      name: '`currentStepIndex()`',
      description: 'Computed signal returning the zero-based index of the currently active step.',
    },
    {
      name: '`currentStep()`',
      description: 'Computed signal returning the currently active ProcessStep, or undefined.',
    },
  ];

  // ── Step Content Development ─────────────────────────────────────

  stepContentDocTableDataSource = [
    {
      name: '`StepContentComponent<T>`',
      description:
        'Abstract base class that step content components must extend. Provides an inputData signal of type T for receiving data from the parent, and viewChild references (actionsLeft, actionsRight) for action templates.',
    },
    {
      name: '`StepContent<C>`',
      description:
        'Interface defining step content with a component class and optional inputData. Generic C is the component type for automatic type inference.',
    },
    {
      name: '`createStepContent(config)`',
      description:
        'Helper function to create StepContent with automatic TypeScript type inference for inputData based on the component type. Always prefer this over manual object creation.',
    },
    {
      name: '`ProcessStep`',
      description: 'Type defining a step with key, label, optional description, and an AbstractControl for validation state.',
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
