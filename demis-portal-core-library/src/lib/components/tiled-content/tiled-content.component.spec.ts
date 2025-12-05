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

import { TiledContentComponent } from './tiled-content.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MaxContainerHeightService } from '../../services/max-container-height.service';

describe('TiledContentComponent', () => {
  let component: TiledContentComponent;
  let fixture: MockedComponentFixture<TiledContentComponent, TiledContentComponent>;

  beforeEach(() => MockBuilder(TiledContentComponent).mock(CommonModule).mock(MatSidenavModule));

  beforeEach(() => {
    fixture = MockRender(TiledContentComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the refresh method after changes', () => {
    const calculateMaxContainerHeightSpy = spyOn(TestBed.inject(MaxContainerHeightService), 'calculateMaxContainerHeight').and.returnValue('100px');
    component.ngOnChanges({});
    expect(calculateMaxContainerHeightSpy).toHaveBeenCalled();
  });
});
