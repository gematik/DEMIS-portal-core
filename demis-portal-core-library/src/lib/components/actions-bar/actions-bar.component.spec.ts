/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { ActionsBarComponent } from './actions-bar.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

describe('ActionsBarComponent', () => {
  let component: ActionsBarComponent;
  let fixture: MockedComponentFixture<ActionsBarComponent, ActionsBarComponent>;

  beforeEach(() => MockBuilder(ActionsBarComponent));

  beforeEach(() => {
    fixture = MockRender(ActionsBarComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class', () => {
    const hostElement: HTMLElement = fixture.point.nativeElement;
    expect(hostElement.classList.contains('mat-app-background')).toBeTrue();
  });
});
