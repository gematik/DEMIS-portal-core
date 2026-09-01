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
import { AriaDisabledButtonExample1Component } from '../code-snippets/aria-disabled-button/example-1.component';
import { AriaDisabledButtonExample2Component } from '../code-snippets/aria-disabled-button/example-2.component';
import { AriaDisabledButtonExample3Component } from '../code-snippets/aria-disabled-button/example-3.component';
import { CodeExampleBoxComponent, CodeExampleBoxComponentOptions } from '../utils/code-example-box.component';
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-aria-disabled-button-consumer',
  standalone: true,
  imports: [
    AriaDisabledButtonExample1Component,
    AriaDisabledButtonExample2Component,
    AriaDisabledButtonExample3Component,
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
          Keeps a disabled action keyboard-focusable while exposing its state with <code>aria-disabled</code>. Use it when users need an explanation of why an
          action is currently unavailable. Whether the fixed German submit announcement is added automatically depends only on the button's native
          <code>type</code>, as shown in the three examples below.
        </p>

        <app-subsection-title>Import</app-subsection-title>
        <app-code-snippet-box language="ts" codeSnippetString='import { GemDemisAriaDisabledButtonDirective } from "@gematik/demis-portal-core-library";' />

        <app-subsection-title>Selector</app-subsection-title>
        <app-code-snippet-box language="html" codeSnippetString="button[gemDemisAriaDisabled]" />

        <app-subsection-title>Bindings</app-subsection-title>
        <app-doc-table [dataSource]="bindingsDocTableDataSource" />

        <app-subsection-title>Submit announcement by button type</app-subsection-title>
        <app-doc-table [dataSource]="submitAnnouncementDocTableDataSource" />
      </app-overview-section>

      <app-code-example-box [options]="examples[0]">
        <app-aria-disabled-button-example-1 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[1]">
        <app-aria-disabled-button-example-2 />
      </app-code-example-box>

      <app-code-example-box [options]="examples[2]">
        <app-aria-disabled-button-example-3 />
      </app-code-example-box>
    </app-expandable-sections>
  `,
})
export class AriaDisabledButtonConsumerComponent {
  readonly bindingsDocTableDataSource = [
    {
      name: '`gemDemisAriaDisabled: boolean`',
      description: 'Required state. When true, the button remains focusable and exposes aria-disabled="true".',
    },
    {
      name: '`gemDemisAriaDisabledDescribedBy: string`',
      description: 'Optional id of the element that explains why the action is unavailable.',
    },
    {
      name: '`gemDemisActivationBlocked`',
      description:
        'Optional low-level hook, e.g. to move focus to a validation summary. A click or Enter/Space on an ARIA-disabled button stays otherwise inert on purpose: it must not look or feel like a working control.',
    },
  ];

  readonly submitAnnouncementDocTableDataSource = [
    {
      name: 'No `type` attribute',
      description: 'Implicit submit button per HTML default. The fixed German submit announcement is added automatically (Example 1).',
    },
    {
      name: '`type="submit"`',
      description: 'Explicit submit button. The fixed German submit announcement is added automatically, same as the implicit case (Example 2).',
    },
    {
      name: '`type="button"`',
      description:
        'Non-submit action. The button still stays focusable and blocked while disabled, but no submit announcement is added; supply your own explanation via gemDemisAriaDisabledDescribedBy (Example 3).',
    },
  ];

  readonly examples: CodeExampleBoxComponentOptions[] = [
    {
      expanderTitle: 'Example 1',
      expanderDescription: 'No type attribute: an implicit submit button gets the fixed submit announcement automatically.',
      standalonePath: '/examples/directives/aria-disabled-button/example-1',
      codeSnippets: [
        {
          fileName: 'example-1.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
        {
          fileName: 'example-1.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
      ],
    },
    {
      expanderTitle: 'Example 2',
      expanderDescription: 'type="submit": an explicit submit button gets the same automatic announcement as Example 1.',
      standalonePath: '/examples/directives/aria-disabled-button/example-2',
      codeSnippets: [
        {
          fileName: 'example-2.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
        {
          fileName: 'example-2.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
      ],
    },
    {
      expanderTitle: 'Example 3',
      expanderDescription: 'type="button": stays focusable and blocked, but needs its own explanation since it is not a submit action.',
      standalonePath: '/examples/directives/aria-disabled-button/example-3',
      codeSnippets: [
        {
          fileName: 'example-3.component.html',
          language: 'html',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
        {
          fileName: 'example-3.component.ts',
          language: 'ts',
          codeSnippetPath: 'code-snippets/aria-disabled-button',
        },
      ],
    },
  ];
}
