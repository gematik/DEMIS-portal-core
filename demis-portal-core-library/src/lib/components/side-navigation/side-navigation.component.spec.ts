/*
    Copyright (c) 2026 gematik GmbH
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

import { Component, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { SideNavigationComponent, StepContentComponent, StepNavigationService, createStepContent } from './side-navigation.component';
import { ProcessStep, DemisProcessStepperComponent, StepChangeEvent } from '../process-stepper/process-stepper.component';

// Test component that extends StepContentComponent
@Component({
  selector: 'gem-test-step-content',
  template: `
    <div>Test Content</div>
    <ng-template #actionsLeft>
      <button>Left Action</button>
    </ng-template>
    <ng-template #actionsRight>
      <button>Right Action</button>
    </ng-template>
  `,
  standalone: true,
})
class TestStepContentComponent extends StepContentComponent<any> {}

// Test component without action templates
@Component({
  selector: 'gem-test-step-content-no-actions',
  template: '<div>Content without actions</div>',
  standalone: true,
})
class TestStepContentNoActionsComponent extends StepContentComponent<any> {}

// Test component with typed input data
@Component({
  selector: 'gem-test-step-content-with-data',
  template: '<div>{{ inputData()?.name }}</div>',
  standalone: true,
})
class TestStepContentWithDataComponent extends StepContentComponent<{ name: string }> {}

describe('SideNavigationComponent', () => {
  let component: SideNavigationComponent;
  let fixture: MockedComponentFixture<any>;

  // Helper to create mock steps
  const createMockSteps = (): ProcessStep[] => [
    {
      key: 'step1',
      label: 'Step 1',
      control: new FormControl('', Validators.required),
    },
    {
      key: 'step2',
      label: 'Step 2',
      control: new FormControl(''),
    },
    {
      key: 'step3',
      label: 'Step 3',
      control: new FormControl(''),
    },
  ];

  beforeEach(() => MockBuilder(SideNavigationComponent).keep(DemisProcessStepperComponent, { shallow: true }));

  describe('Component Creation and Initialization', () => {
    it('should create', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      expect(component).toBeTruthy();
    });

    it('should initialize with required inputs', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Navigation Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      expect(component.sideNavTitle()).toBe('Test Navigation Title');
      expect(component.stepsMap()).toBe(stepsMap);
      expect(component.steps().length).toBe(1);
    });

    it('should compute steps array from stepsMap', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[1], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[2], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      expect(component.steps().length).toBe(3);
      expect(component.steps()).toEqual([steps[0], steps[1], steps[2]]);
    });

    it('should handle empty stepsMap', () => {
      const stepsMap = new Map();

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      expect(component.steps().length).toBe(0);
    });

    it('should provide StepNavigationService', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      const service = ngMocks.findInstance(StepNavigationService);
      expect(service).toBeTruthy();
      expect(service).toBe(ngMocks.findInstance(SideNavigationComponent));
    });
  });

  describe('Step Content Management', () => {
    it('should set first step content on ngAfterViewInit', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Trigger ngAfterViewInit manually if needed
      expect(component.currentComponentInstance()).toBeTruthy();
      expect(component.currentComponentInstance()).toBeInstanceOf(TestStepContentComponent);
    });

    it('should switch step content when onStepChanged is called', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[1], createStepContent({ component: TestStepContentNoActionsComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Initially should show first step content
      expect(component.currentComponentInstance()).toBeInstanceOf(TestStepContentComponent);

      // Simulate step change
      const event: StepChangeEvent = {
        selectedIndex: 1,
        selectedStep: steps[1],
        previouslySelectedIndex: 0,
        previouslySelectedStep: steps[0],
      };

      component.onStepChanged(event);
      fixture.detectChanges();

      // Should now show second step content
      expect(component.currentComponentInstance()).toBeInstanceOf(TestStepContentNoActionsComponent);
    });

    it('should pass inputData to step content component', () => {
      const steps = createMockSteps();
      const testData = { name: 'John Doe' };
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentWithDataComponent, inputData: testData }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      expect(component.currentComponentInstance()).toBeInstanceOf(TestStepContentWithDataComponent);
      const currentInstance = component.currentComponentInstance() as TestStepContentWithDataComponent;
      expect(currentInstance.inputData()).toEqual(testData);
    });

    it('should destroy previous component when switching steps', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[1], createStepContent({ component: TestStepContentNoActionsComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      const firstInstance = component.currentComponentInstance();
      expect(firstInstance).toBeTruthy();

      // Switch to second step
      const event: StepChangeEvent = {
        selectedIndex: 1,
        selectedStep: steps[1],
        previouslySelectedIndex: 0,
        previouslySelectedStep: steps[0],
      };

      component.onStepChanged(event);
      fixture.detectChanges();

      const secondInstance = component.currentComponentInstance();
      expect(secondInstance).toBeTruthy();
      expect(secondInstance).not.toBe(firstInstance);
    });

    it('should handle undefined step content gracefully', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Simulate step change to unmapped step
      const event: StepChangeEvent = {
        selectedIndex: 1,
        selectedStep: steps[1],
        previouslySelectedIndex: 0,
        previouslySelectedStep: steps[0],
      };

      component.onStepChanged(event);
      fixture.detectChanges();

      expect(component.currentComponentInstance()).toBeNull();
    });
  });

  describe('Action Templates', () => {
    it('should expose actionsLeft from current component', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);
      fixture.detectChanges();

      expect(component.currentActionsLeft()).toBeInstanceOf(TemplateRef);
    });

    it('should expose actionsRight from current component', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);
      fixture.detectChanges();

      expect(component.currentActionsRight()).toBeInstanceOf(TemplateRef);
    });

    it('should return null for actions when component has no action templates', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentNoActionsComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);
      fixture.detectChanges();

      expect(component.currentActionsLeft()).toBeNull();
      expect(component.currentActionsRight()).toBeNull();
    });
  });

  describe('Navigation Methods (StepNavigationService)', () => {
    beforeEach(() => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[1], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);
    });

    it('should delegate next() to internalStepper', () => {
      const stepper = component.internalStepper();
      if (stepper) {
        spyOn(stepper, 'next');
        component.next();
        expect(stepper.next).toHaveBeenCalled();
      }
    });

    it('should delegate previous() to internalStepper', () => {
      const stepper = component.internalStepper();
      if (stepper) {
        spyOn(stepper, 'previous');
        component.previous();
        expect(stepper.previous).toHaveBeenCalled();
      }
    });

    it('should delegate reset() to internalStepper', () => {
      const stepper = component.internalStepper();
      if (stepper) {
        spyOn(stepper, 'reset');
        component.reset();
        expect(stepper.reset).toHaveBeenCalled();
      }
    });

    it('should compute canGoToNext from internalStepper', () => {
      const stepper = component.internalStepper();
      if (stepper) {
        spyOn(stepper, 'canGoToNext').and.returnValue(true);
        expect(component.canGoToNext()).toBe(true);
      }
    });

    it('should compute canGoToPrevious from internalStepper', () => {
      const stepper = component.internalStepper();
      if (stepper) {
        spyOn(stepper, 'canGoToPrevious').and.returnValue(false);
        expect(component.canGoToPrevious()).toBe(false);
      }
    });

    it('should return false for canGoToNext when internalStepper is undefined', () => {
      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(component.canGoToNext()).toBe(false);
    });

    it('should return false for canGoToPrevious when internalStepper is undefined', () => {
      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(component.canGoToPrevious()).toBe(false);
    });

    it('should handle next() when internalStepper is undefined', () => {
      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(() => component.next()).not.toThrow();
    });

    it('should handle previous() when internalStepper is undefined', () => {
      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(() => component.previous()).not.toThrow();
    });

    it('should handle reset() when internalStepper is undefined', () => {
      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(() => component.reset()).not.toThrow();
    });
  });

  describe('ngOnChanges Lifecycle', () => {
    it('should update step content on ngOnChanges', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));
      stepsMap.set(steps[1], createStepContent({ component: TestStepContentNoActionsComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Mock the internalStepper to return a specific step
      const mockStepper = component.internalStepper();
      if (mockStepper) {
        Object.defineProperty(mockStepper, 'currentStep', {
          value: () => steps[1],
          writable: true,
        });
      }

      component.ngOnChanges();
      fixture.detectChanges();

      // Should update to the current step's content
      expect(component.currentComponentInstance()).toBeInstanceOf(TestStepContentNoActionsComponent);
    });

    it('should handle ngOnChanges when internalStepper is undefined', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      Object.defineProperty(component, 'internalStepper', {
        value: () => undefined,
        writable: true,
      });

      expect(() => component.ngOnChanges()).not.toThrow();
    });
  });

  describe('Helper Functions', () => {
    it('createStepContent should return the same object with proper typing', () => {
      const content = createStepContent({
        component: TestStepContentWithDataComponent,
        inputData: { name: 'Test' },
      });

      expect(content.component).toBe(TestStepContentWithDataComponent);
      expect(content.inputData).toEqual({ name: 'Test' });
    });

    it('createStepContent should work without inputData', () => {
      const content = createStepContent({
        component: TestStepContentComponent,
      });

      expect(content.component).toBe(TestStepContentComponent);
      expect(content.inputData).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle dynamicComponentContainer being undefined in setStepContent', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Mock dynamicComponentContainer to return undefined
      Object.defineProperty(component, 'dynamicComponentContainer', {
        value: () => undefined,
        writable: true,
      });

      const event: StepChangeEvent = {
        selectedIndex: 0,
        selectedStep: steps[0],
        previouslySelectedIndex: 0,
        previouslySelectedStep: undefined,
      };

      // Should not throw
      expect(() => component.onStepChanged(event)).not.toThrow();
    });

    it('should clear currentComponentInstance when step content has no component', () => {
      const steps = createMockSteps();
      const stepsMap = new Map();
      stepsMap.set(steps[0], createStepContent({ component: TestStepContentComponent }));

      fixture = MockRender(SideNavigationComponent, {
        sideNavTitle: 'Test Title',
        stepsMap: stepsMap,
      });

      component = ngMocks.findInstance(fixture.debugElement, SideNavigationComponent);

      // Initially has a component
      expect(component.currentComponentInstance()).toBeTruthy();

      // Simulate step change to undefined step content
      const event: StepChangeEvent = {
        selectedIndex: 1,
        selectedStep: steps[1],
        previouslySelectedIndex: 0,
        previouslySelectedStep: steps[0],
      };

      component.onStepChanged(event);

      expect(component.currentComponentInstance()).toBeNull();
    });
  });
});
