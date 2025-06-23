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

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { MAT_CARD_CONFIG } from '@angular/material/card';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormlyDatepickerComponent, FormlyRepeaterComponent } from '@gematik/demis-portal-core-library';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: de },
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      FormlyModule.forRoot({
        validationMessages: [{ name: 'required', message: 'Diese Angabe wird benötigt' }],
        types: [
          {
            name: 'repeat',
            component: FormlyRepeaterComponent,
          },
          {
            name: 'datepicker',
            component: FormlyDatepickerComponent,
          },
        ],
      }),
      FormlyMaterialModule,
    ]),
    provideHttpClient(),
    { provide: MAT_CARD_CONFIG, useValue: { appearance: 'outlined' } },
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
    }),
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.ERROR,
        disableConsoleLogging: false,
        serverLogLevel: NgxLoggerLevel.OFF,
      })
    ),
  ],
};
