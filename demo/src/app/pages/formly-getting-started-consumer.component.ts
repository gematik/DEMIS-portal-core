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
import { CodeSnippetBoxComponent } from '../utils/code-snippet-box.component';
import { DocTableComponent } from '../utils/doc-table.component';
import { ExpandableSectionsComponent } from '../utils/expandable-sections.component';
import { OverviewSectionComponent } from '../utils/overview-section.component';
import { SubsectionTitleComponent } from '../utils/subsection-title.component';

@Component({
  selector: 'app-formly-getting-started-consumer',
  standalone: true,
  imports: [SubsectionTitleComponent, OverviewSectionComponent, DocTableComponent, ExpandableSectionsComponent, CodeSnippetBoxComponent, RouterLink],

  template: `
    <app-expandable-sections>
      <app-overview-section>
        <p>
          The portal-core library provides several custom Formly field types that can be used across all DEMIS portal microfrontends. Instead of registering
          each type manually, you can use the <code>withDemisFormlyCore()</code>
          convenience function to register all portal-core Formly types and validation messages at once.
        </p>

        <app-subsection-title>Quick setup</app-subsection-title>
        <p>
          Call <code>withDemisFormlyCore()</code> inside <code>provideFormlyCore()</code> and spread the result alongside <code>withFormlyMaterial()</code> and
          any app-specific configuration:
        </p>

        <app-code-snippet-box [codeSnippetString]="quickSetupSnippet" language="typescript" />

        <app-subsection-title>What gets registered</app-subsection-title>
        <p><code>withDemisFormlyCore()</code> returns a <code>ConfigOption[]</code> that registers the following Formly types and validation messages:</p>
        <app-doc-table [dataSource]="registeredTypesDataSource" />

        <app-subsection-title>Validation messages</app-subsection-title>
        <app-doc-table [dataSource]="validationMessagesDataSource" />

        <app-subsection-title>Individual imports</app-subsection-title>
        <p>
          You can still import and register each component individually if you need more control. All components and the
          <code>DATEPICKER_VALIDATION_MESSAGES</code> constant remain available as direct exports from <code>&#64;gematik/demis-portal-core-library</code>:
        </p>

        <app-code-snippet-box [codeSnippetString]="manualSetupSnippet" language="typescript" />

        <app-subsection-title>Available types</app-subsection-title>
        <p>For detailed documentation and live examples of each type, see the individual pages:</p>
        <ul>
          <li><a routerLink="/formly/datepicker">Datepicker</a> — Multi-precision date input (day/month/year)</li>
          <li><a routerLink="/formly/repeater">Repeater</a> — Dynamic field array with add/remove</li>
          <li><a routerLink="/formly/filterable-select">Filterable Select</a> — Searchable dropdown with multi-select and chips</li>
        </ul>
      </app-overview-section>
    </app-expandable-sections>
  `,
})
export class FormlyGettingStartedConsumerComponent {
  quickSetupSnippet = `import { withDemisFormlyCore } from '@gematik/demis-portal-core-library';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

// In your app config or module providers:
provideFormlyCore([
  ...withFormlyMaterial(),
  {
    // app-specific types, wrappers, extensions...
    types: [
      { name: 'my-custom-type', component: MyCustomComponent },
    ],
  },
  ...withDemisFormlyCore(),
])`;

  manualSetupSnippet = `import {
  FormlyDatepickerComponent,
  FormlyRepeaterComponent,
  FormlyFilterableSelectComponent,
  DATEPICKER_VALIDATION_MESSAGES,
} from '@gematik/demis-portal-core-library';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

provideFormlyCore([
  ...withFormlyMaterial(),
  {
    types: [
      { name: 'datepicker', component: FormlyDatepickerComponent, wrappers: ['form-field'] },
      { name: 'repeater', component: FormlyRepeaterComponent },
      { name: 'filterable-select', component: FormlyFilterableSelectComponent, wrappers: ['form-field'] },
    ],
    validationMessages: [...DATEPICKER_VALIDATION_MESSAGES],
  },
])`;

  registeredTypesDataSource = [
    {
      name: '`datepicker`',
      description: ['Multi-precision date picker (day, month, year). Wrapped with `form-field`.', 'Component: `FormlyDatepickerComponent`'],
    },
    {
      name: '`repeater`',
      description: ['Dynamic field array with add/remove buttons.', 'Component: `FormlyRepeaterComponent`'],
    },
    {
      name: '`filterable-select`',
      description: ['Searchable dropdown with optional multi-select and chips. Wrapped with `form-field`.', 'Component: `FormlyFilterableSelectComponent`'],
    },
  ];

  validationMessagesDataSource = [
    {
      name: '`formatMismatch`',
      description: ['Shown when the entered date does not match any of the allowed precision formats.'],
    },
    {
      name: '`invalidDate`',
      description: ['Shown when the entered date is not a valid calendar date.'],
    },
    {
      name: '`matDatepickerMin`',
      description: ['Shown when the entered date is before the configured minimum date.'],
    },
    {
      name: '`matDatepickerMax`',
      description: ['Shown when the entered date is after the configured maximum date.'],
    },
  ];
}
