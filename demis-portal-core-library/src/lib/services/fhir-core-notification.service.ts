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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { catchError } from 'rxjs/operators';
import { MessageDialogService } from './message-dialog.service';

export interface FollowUpNotificationCategory {
  notificationCategory: string;
}

@Injectable({
  providedIn: 'root',
})
export class FhirCoreNotificationService {
  protected httpClient: HttpClient;
  protected logger: NGXLogger;
  private readonly errorDialogService = inject(MessageDialogService);

  constructor() {
    const http = inject(HttpClient);
    const logger = inject(NGXLogger);

    this.httpClient = http;
    this.logger = logger;
  }

  private static getEnvironmentHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  fetchFollowUpNotificationCategory(id: string, pathToDestinationLookup: string) {
    const path = `${pathToDestinationLookup}/notification/${id}/notificationCategory`;
    return this.httpClient
      .get<FollowUpNotificationCategory>(path, {
        headers: FhirCoreNotificationService.getEnvironmentHeaders(),
      })
      .pipe(
        catchError(error => {
          if (this.isServerError(error.status)) {
            this.logger.error('Error fetching notification', error);
            this.errorDialogService.showErrorDialog({
              redirectToHome: true,
              errorTitle: 'Es gibt ein internes Problem beim Abholen der Meldung. Bitte probieren Sie es später nochmal.',
              errors: [
                {
                  text: this.errorDialogService.extractMessageFromError(error),
                },
              ],
            });
          }
          throw error;
        })
      );
  }

  private isServerError(status: number): boolean {
    return Number.isInteger(status) && status >= 500 && status <= 599;
  }
}
