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

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal, Type, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Resolve, ResolveFn, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { routes as appRoutes } from '../app.routes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TitleCasePipe,
  ],
})
export class NavigationComponent {
  activeComponentTitle: WritableSignal<string | Type<Resolve<string>> | ResolveFn<string> | undefined> = signal('');
  routeGroups = ['components', 'services', 'directives', 'pipes', 'functions'];
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait,
      Breakpoints.WebPortrait,
    ])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  getRoutes(routesGroup: string) {
    return appRoutes
      .filter(route => route.component && route.path?.startsWith(`${routesGroup}/`))
      .sort((a, b) => a.title?.toString().localeCompare(b.title?.toString() ?? '') ?? 0);
  }

  onActivateRoute(event: any) {
    this.activeComponentTitle.set(event.constructor.name);
    for (const route of this.router.config) {
      if (route.component && event instanceof route.component) {
        this.activeComponentTitle.set(route.title);
        break;
      }
    }
  }
}
