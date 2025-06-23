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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { MaxContainerHeightService } from '../../services/max-container-height.service';
import { MaxHeightContentContainerComponent } from './max-height-content-container.component';

@Component({
  template: `
    <div id="something" style="height: {{ somethingHeight() }}px"></div>
    <div id="different" style="height: {{ differentHeight() }}px"></div>
    <gem-demis-max-height-content-container id="max-height-container" [elementSelectorsToSubtract]="testElements()">
      <div>Content</div>
    </gem-demis-max-height-content-container>
  `,
  standalone: true,
  imports: [MaxHeightContentContainerComponent, CommonModule],
})
class MaxHeightContextComponent {
  testElements = jasmine.createSpy('testElements').and.returnValue(['#something']);

  somethingHeight = jasmine.createSpy('somethingHeight').and.returnValue(22);
  differentHeight = jasmine.createSpy('differentHeight').and.returnValue(0);
}

describe('MaxHeightContentContainerComponent', () => {
  let component: MaxHeightContextComponent;
  let maxHeightContainerComponent: MaxHeightContentContainerComponent;
  let fixture: MockedComponentFixture<MaxHeightContextComponent>;

  beforeEach(() => MockBuilder(MaxHeightContextComponent).keep(MaxHeightContentContainerComponent).mock(MaxContainerHeightService).mock(CommonModule));

  beforeEach(() => {
    fixture = MockRender(MaxHeightContextComponent);
    component = fixture.point.componentInstance;
    maxHeightContainerComponent = ngMocks.find(fixture.debugElement, MaxHeightContentContainerComponent).componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(maxHeightContainerComponent).toBeTruthy();
  });

  it('should have the correct elementSelectorsToSubtract value after init', () => {
    expect(maxHeightContainerComponent.elementSelectorsToSubtract).toEqual(['#something']);
  });

  it('should subscribe to resizeTrigger and call refreshMaxClientHeight after debounce', done => {
    const refreshSpy = spyOn<any>(maxHeightContainerComponent, 'refreshMaxClientHeight');
    maxHeightContainerComponent.ngOnInit();
    (maxHeightContainerComponent as any).resizeTrigger.next();
    setTimeout(() => {
      expect(refreshSpy).toHaveBeenCalledWith((maxHeightContainerComponent as any).elementsToSubtract);
      done();
    }, 15); // wait a bit longer than debouncing, then check if the refresh function was called
  });

  it('should have the correct elementSelectorsToSubtract value after change', () => {
    expect(maxHeightContainerComponent.elementSelectorsToSubtract).toEqual(['#something']);

    component.testElements.and.returnValue(['#something', '#different']);
    fixture.detectChanges();

    expect(maxHeightContainerComponent.elementSelectorsToSubtract).toEqual(['#something', '#different']);
  });
});
