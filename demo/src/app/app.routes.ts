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

import { Routes } from '@angular/router';
import { SectionTitleConsumerComponent } from './pages/section-title-consumer.component';
import { HomeComponent } from './pages/home.component';
import { MessageDialogConsumerComponent } from './pages/message-dialog-consumer.component';
import { FormlyDatepickerConsumerComponent } from './pages/formly-datepicker-consumer.component';
import { PasteBoxConsumerComponent } from './pages/paste-box-consumer.component';
import { FormlyRepeaterConsumerComponent } from './pages/formly-repeater-consumer.component';
import { StepperConsumerComponent } from './pages/sidebar-navigation-consumer.component';

function prefixRoutes(prefix: string, routes: Routes): Routes {
  return routes.map(route => ({ ...route, path: `${prefix}/${route.path}` }));
}

// Routes for the components
const componentConsumerRoutes: Routes = [
  {
    path: 'section-title',
    title: 'Section Title',
    pathMatch: 'full',
    component: SectionTitleConsumerComponent,
  },
  {
    path: 'paste-box',
    title: 'Paste Box',
    pathMatch: 'full',
    component: PasteBoxConsumerComponent,
  },
  {
    path: 'formly-repeater',
    title: 'Formly Repeater',
    pathMatch: 'full',
    component: FormlyRepeaterConsumerComponent,
  },
  {
    path: 'formly-datepicker',
    title: 'Formly Datepicker ',
    pathMatch: 'full',
    component: FormlyDatepickerConsumerComponent,
  },
  {
    path: 'process-stepper',
    title: 'Process Stepper',
    pathMatch: 'full',
    component: StepperConsumerComponent,
  },
];

// Routes for the services
const serviceConsumerRoutes: Routes = [
  {
    path: 'message-dialog',
    title: 'Message Dialog Service',
    pathMatch: 'full',
    component: MessageDialogConsumerComponent,
  },
];

// Routes for the directives
const directiveConsumerRoutes: Routes = [];

// Routes for the pipes
const pipeConsumerRoutes: Routes = [];

// Routes for the functions
const functionConsumerRoutes: Routes = [];

// Build the main routes
export const routes: Routes = [
  {
    path: '',
    title: 'DEMIS Portal Core Library - Demo App',
    pathMatch: 'full',
    component: HomeComponent,
  },
  ...prefixRoutes('components', componentConsumerRoutes),
  ...prefixRoutes('services', serviceConsumerRoutes),
  ...prefixRoutes('directives', directiveConsumerRoutes),
  ...prefixRoutes('pipes', pipeConsumerRoutes),
  ...prefixRoutes('functions', functionConsumerRoutes),
];
