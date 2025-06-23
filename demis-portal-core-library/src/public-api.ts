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

/*
 * Public API Surface of demis-portal-core-library
 */

/***********************************************
 * COMPONENTS
 **********************************************/
export * from './lib/components/actions-bar/actions-bar.component';
export * from './lib/components/file-name-chip/file-name-chip.component';
export * from './lib/components/file-select/file-select.component';
export * from './lib/components/max-height-content-container/max-height-content-container.component';
export * from './lib/components/paste-box/paste-box.component';
export * from './lib/components/process-stepper/process-stepper.component';
export * from './lib/components/section-title/section-title.component';
export * from './lib/components/tiled-content/tiled-content.component';
export * from './lib/components/formly-repeater/formly-repeater.component';
export * from './lib/components/formly-datepicker/formly-datepicker.component';

/***********************************************
 * DIRECTIVES
 **********************************************/
export * from './lib/directives/secondary-button.directive';

/***********************************************
 * PIPES
 **********************************************/
export * from './lib/pipes/file-size.pipe';

/***********************************************
 * SERVICES
 **********************************************/
export * from './lib/services/message-dialog.service';

/***********************************************
 * MODULES
 **********************************************/
export * from './lib/demis-portal-shared.module';

/***********************************************
 * FUNCTIONS
 **********************************************/
export * from './lib/utils/apply-recursivly.function';
export * from './lib/utils/trim-strings.function';
export * from './lib/utils/clone-object.function';
