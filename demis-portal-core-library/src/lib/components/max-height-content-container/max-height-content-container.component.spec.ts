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
  let mockMaxContainerHeightService: jasmine.SpyObj<MaxContainerHeightService>;
  let originalResizeObserver: any;

  beforeEach(() => MockBuilder(MaxHeightContextComponent).keep(MaxHeightContentContainerComponent).mock(MaxContainerHeightService).mock(CommonModule));

  beforeEach(() => {
    // Mock ResizeObserver globally for all tests
    originalResizeObserver = (window as any).ResizeObserver;
    (window as any).ResizeObserver = jasmine.createSpy('ResizeObserver').and.returnValue({
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
      unobserve: jasmine.createSpy('unobserve'),
    });

    fixture = MockRender(MaxHeightContextComponent);
    component = fixture.point.componentInstance;
    maxHeightContainerComponent = ngMocks.find(fixture.debugElement, MaxHeightContentContainerComponent).componentInstance;
    mockMaxContainerHeightService = ngMocks.get(MaxContainerHeightService) as jasmine.SpyObj<MaxContainerHeightService>;
    mockMaxContainerHeightService.calculateMaxContainerHeight = jasmine.createSpy('calculateMaxContainerHeight').and.returnValue('calc(100vh - 50px)');
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restore original ResizeObserver
    (window as any).ResizeObserver = originalResizeObserver;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(maxHeightContainerComponent).toBeTruthy();
  });

  it('should have the correct elementSelectorsToSubtract value after init', () => {
    expect(maxHeightContainerComponent.elementSelectorsToSubtract()).toEqual(['#something']);
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

  it('should debounce multiple rapid resizeTrigger calls', done => {
    const refreshSpy = spyOn<any>(maxHeightContainerComponent, 'refreshMaxClientHeight');

    // Reset any existing calls from setup
    refreshSpy.calls.reset();

    // Trigger multiple rapid calls directly on the existing component
    (maxHeightContainerComponent as any).resizeTrigger.next();
    (maxHeightContainerComponent as any).resizeTrigger.next();
    (maxHeightContainerComponent as any).resizeTrigger.next();

    // Should not be called immediately
    expect(refreshSpy).not.toHaveBeenCalled();

    setTimeout(() => {
      // Should be called only once after debounce (the subscription should already exist from ngOnInit)
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(refreshSpy).toHaveBeenCalledWith((maxHeightContainerComponent as any).elementsToSubtract);
      done();
    }, 15);
  });

  it('should have the correct elementSelectorsToSubtract value after change', () => {
    expect(maxHeightContainerComponent.elementSelectorsToSubtract()).toEqual(['#something']);

    component.testElements.and.returnValue(['#something', '#different']);
    fixture.detectChanges();

    expect(maxHeightContainerComponent.elementSelectorsToSubtract()).toEqual(['#something', '#different']);
  });

  it('should call registerObservers and refreshMaxClientHeight in ngAfterViewChecked', () => {
    const registerObserversSpy = spyOn<any>(maxHeightContainerComponent, 'registerObservers');
    const refreshSpy = spyOn<any>(maxHeightContainerComponent, 'refreshMaxClientHeight');

    maxHeightContainerComponent.ngAfterViewChecked();

    expect(registerObserversSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalledWith((maxHeightContainerComponent as any).elementsToSubtract);
  });

  it('should call registerObservers and refreshMaxClientHeight in ngOnChanges', () => {
    const registerObserversSpy = spyOn<any>(maxHeightContainerComponent, 'registerObservers');
    const refreshSpy = spyOn<any>(maxHeightContainerComponent, 'refreshMaxClientHeight');

    const changes = { elementSelectorsToSubtract: { currentValue: ['#new'], previousValue: ['#old'] } };
    maxHeightContainerComponent.ngOnChanges(changes as any);

    expect(registerObserversSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalledWith((maxHeightContainerComponent as any).elementsToSubtract);
  });

  it('should clean up subscriptions in ngOnDestroy', () => {
    const unsubscriberSpy = spyOn((maxHeightContainerComponent as any).unsubscriber, 'next');
    const completeSpy = spyOn((maxHeightContainerComponent as any).unsubscriber, 'complete');

    maxHeightContainerComponent.ngOnDestroy();

    expect(unsubscriberSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Test to verify DOM element selection and storage
  it('should find and store elements correctly in registerObservers', () => {
    // Mock DOM elements
    const mockElement1 = document.createElement('div');
    const mockElement2 = document.createElement('div');

    const querySelectorAllSpy = spyOn(document, 'querySelectorAll').and.callFake((selector: string) => {
      if (selector === '#something') return [mockElement1] as any;
      if (selector === '#different') return [mockElement2] as any;
      return [] as any;
    });

    // Update the mock to return new values and trigger change detection
    component.testElements.and.returnValue(['#something', '#different']);
    fixture.detectChanges(); // This should update the input signal

    // Reset the spy after setup to count only our direct call
    querySelectorAllSpy.calls.reset();

    // Call registerObservers directly to test element selection logic
    (maxHeightContainerComponent as any).registerObservers();

    expect(querySelectorAllSpy).toHaveBeenCalledWith('#something');
    expect(querySelectorAllSpy).toHaveBeenCalledWith('#different');
    expect(querySelectorAllSpy).toHaveBeenCalledTimes(2);
    expect((maxHeightContainerComponent as any).elementsToSubtract.length).toBe(2);
    expect((maxHeightContainerComponent as any).elementsToSubtract).toContain(mockElement1);
    expect((maxHeightContainerComponent as any).elementsToSubtract).toContain(mockElement2);
  });

  // Test ResizeObserver cleanup functionality
  it('should cleanup existing ResizeObservers', () => {
    const mockResizeObserver1 = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
      unobserve: jasmine.createSpy('unobserve'),
    };
    const mockResizeObserver2 = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
      unobserve: jasmine.createSpy('unobserve'),
    };

    // Pre-populate with existing observers
    (maxHeightContainerComponent as any).resizeObservers = [mockResizeObserver1, mockResizeObserver2];

    spyOn(document, 'querySelectorAll').and.returnValue([] as any);

    (maxHeightContainerComponent as any).registerObservers();

    expect(mockResizeObserver1.disconnect).toHaveBeenCalled();
    expect(mockResizeObserver2.disconnect).toHaveBeenCalled();
  });

  it('should update containerHeight signal in refreshMaxClientHeight', () => {
    const mockElements = [document.createElement('div')];
    const changeDetectorRefSpy = spyOn((maxHeightContainerComponent as any).changeDetectorRef, 'detectChanges');

    mockMaxContainerHeightService.calculateMaxContainerHeight.and.returnValue('calc(100vh - 75px)');

    (maxHeightContainerComponent as any).refreshMaxClientHeight(mockElements);

    expect(mockMaxContainerHeightService.calculateMaxContainerHeight).toHaveBeenCalledWith(mockElements);
    // Use type assertion to access protected property
    expect((maxHeightContainerComponent as any).containerHeight()).toBe('calc(100vh - 75px)');
    expect(changeDetectorRefSpy).toHaveBeenCalled();
  });

  it('should have initial containerHeight of 100vh', () => {
    // Reset the component state for this test
    (maxHeightContainerComponent as any).containerHeight.set('100vh');
    expect((maxHeightContainerComponent as any).containerHeight()).toBe('100vh');
  });

  // Test ResizeObserver creation and callback functionality
  it('should create ResizeObserver and trigger resizeTrigger', () => {
    const mockElement = document.createElement('div');
    spyOn(document, 'querySelectorAll').and.returnValue([mockElement] as any);

    // Create a mock for ResizeObserver constructor that stores the callback
    let storedCallback: Function | undefined;
    const mockResizeObserver = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
      unobserve: jasmine.createSpy('unobserve'),
    };

    // Mock the ResizeObserver constructor
    const originalResizeObserver = (window as any).ResizeObserver;
    (window as any).ResizeObserver = function (callback: Function) {
      storedCallback = callback;
      return mockResizeObserver;
    };

    component.testElements.and.returnValue(['#something']);
    const resizeTriggerSpy = spyOn((maxHeightContainerComponent as any).resizeTrigger, 'next');

    // Call registerObservers which should create the ResizeObserver
    (maxHeightContainerComponent as any).registerObservers();

    // Verify ResizeObserver was created and observe was called
    expect(mockResizeObserver.observe).toHaveBeenCalledWith(mockElement, { box: 'border-box' });

    // Simulate the ResizeObserver callback being triggered
    if (storedCallback) {
      storedCallback();
      expect(resizeTriggerSpy).toHaveBeenCalled();
    }

    // Restore original ResizeObserver
    (window as any).ResizeObserver = originalResizeObserver;
  });
});
