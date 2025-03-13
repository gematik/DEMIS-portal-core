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



import { MaxHeightContentContainerComponent } from './max-height-content-container.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { MaxContainerHeightService } from '../../services/max-container-height.service';

describe('MaxHeightContentContainerComponent', () => {
  let component: MaxHeightContentContainerComponent;
  let fixture: MockedComponentFixture<MaxHeightContentContainerComponent, MaxHeightContentContainerComponent>;

  beforeEach(() => MockBuilder(MaxHeightContentContainerComponent).mock(CommonModule).mock(MaxContainerHeightService));

  beforeEach(() => {
    fixture = MockRender(MaxHeightContentContainerComponent);
    fixture.componentInstance.navbarTag = 'app-navbar';
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default navbarTag value', () => {
    expect(component.navbarTag).toBe('app-navbar');
  });
});
