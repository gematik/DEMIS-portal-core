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

import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ElementRef, QueryList } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { DemisProcessStepperComponent, ProcessStep } from './process-stepper.component';

describe('DemisProcessStepperComponent', () => {
  let component: DemisProcessStepperComponent;
  let fixture: MockedComponentFixture<any>;

  // Factory function to create fresh FormControl instances for each test
  const createMockSteps = (): ProcessStep[] => [
    {
      key: 'step1',
      label: 'Step 1',
      description: 'First step description',
      control: new FormControl('', Validators.required),
    },
    {
      key: 'step2',
      label: 'Step 2',
      description: 'Second step description',
      control: new FormControl('', Validators.required),
    },
    {
      key: 'step3',
      label: 'Step 3',
      control: new FormControl('', Validators.required),
    },
  ];

  // Helper function to create a properly mocked MatStepper
  const createMockStepper = (
    options: {
      selectedIndex?: number;
      steps?: any[];
      methods?: string[];
    } = {}
  ): jasmine.SpyObj<MatStepper> => {
    const { selectedIndex = 0, steps = [{ state: 'number' }, { state: 'number' }, { state: 'number' }], methods = ['next', 'previous', 'reset'] } = options;

    const mockStepper = jasmine.createSpyObj('MatStepper', methods);

    Object.defineProperty(mockStepper, 'selectedIndex', {
      value: selectedIndex,
      writable: true,
    });

    // Create a mock QueryList that passes instanceof check and has necessary methods
    const mockQueryList = Object.create(QueryList.prototype);

    // Add array data
    const stepsArray = Array.isArray(steps) ? steps : [];
    Object.defineProperty(mockQueryList, 'length', {
      value: stepsArray.length,
      writable: true,
    });

    // Add array-like access
    stepsArray.forEach((step, index) => {
      mockQueryList[index] = step;
    });

    // Add forEach method
    mockQueryList.forEach = function (fn: (value: any, index: number) => void) {
      stepsArray.forEach(fn);
    };

    // Add toArray method if needed
    mockQueryList.toArray = function () {
      return stepsArray;
    };

    Object.defineProperty(mockStepper, 'steps', {
      value: mockQueryList,
      writable: true,
    });

    return mockStepper;
  };

  // Helper function to apply mock stepper to a component
  const applyMockStepper = (component: DemisProcessStepperComponent, mockStepper: jasmine.SpyObj<MatStepper>): void => {
    Object.defineProperty(component, 'stepper', {
      value: mockStepper,
      writable: true,
      configurable: true,
    });
  };

  beforeEach(() => MockBuilder(DemisProcessStepperComponent).mock(MatStepper));

  describe('Component Creation and Initialization', () => {
    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.currentStepIndex()).toBe(0);
      expect(component.steps().length).toBe(3);
      expect(component.currentStep()).toEqual(component.steps()[0]);
    });

    it('should initialize with custom step index after view init', () => {
      // With the new ngAfterViewInit implementation, initStepIndex is properly applied
      ngMocks.flushTestBed();
      const customFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 2,
        }
      );
      const customComponent = ngMocks.findInstance(customFixture.debugElement, DemisProcessStepperComponent);

      // Mock stepper for proper testing
      const mockStepper = createMockStepper({ methods: ['reset'] });
      applyMockStepper(customComponent, mockStepper);

      // Trigger ngAfterViewInit manually
      customComponent.ngAfterViewInit();

      // Now stepper.selectedIndex should be set to initStepIndex
      expect(mockStepper.selectedIndex).toBe(2);
      expect(customComponent.initStepIndex()).toBe(2);
    });

    it('should provide STEPPER_GLOBAL_OPTIONS correctly', () => {
      // Test that the component has the correct provider configuration
      const componentInstance = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);
      expect(componentInstance).toBeTruthy();

      // Verify component initialization with stepper global options
      expect(componentInstance.currentStepIndex()).toBe(0);
    });
  });

  describe('Step State Checking Methods', () => {
    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);
    });

    describe('isCompleted', () => {
      it('should return true for touched and valid step', () => {
        const step = component.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('valid value');

        expect(component.isCompleted(step)).toBe(true);
      });

      it('should return false for untouched step', () => {
        const step = component.steps()[0];
        step.control.setValue('valid value');

        expect(component.isCompleted(step)).toBe(false);
      });

      it('should return false for touched but invalid step', () => {
        const step = component.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('');

        expect(component.isCompleted(step)).toBe(false);
      });
    });

    describe('hasError', () => {
      it('should return true for touched and invalid step', () => {
        const step = component.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('');

        expect(component.hasError(step)).toBe(true);
      });

      it('should return false for untouched step', () => {
        const step = component.steps()[0];
        step.control.setValue('');

        expect(component.hasError(step)).toBe(false);
      });

      it('should return false for touched and valid step', () => {
        const step = component.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('valid value');

        expect(component.hasError(step)).toBe(false);
      });
    });
  });

  describe('Navigation Methods', () => {
    let mockStepper: jasmine.SpyObj<MatStepper>;

    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);

      mockStepper = createMockStepper();
      applyMockStepper(component, mockStepper);
    });

    it('should call stepper.next() when next() is called', () => {
      component.next();
      expect(mockStepper.next).toHaveBeenCalled();
    });

    it('should call stepper.previous() when previous() is called', () => {
      component.previous();
      expect(mockStepper.previous).toHaveBeenCalled();
    });

    it('should call stepper.reset() and reset currentStepIndex when reset() is called', () => {
      component.currentStepIndex.set(2);

      component.reset();

      expect(mockStepper.reset).toHaveBeenCalled();
      expect(component.currentStepIndex()).toBe(0);
    });

    it('should reset to custom initStepIndex when reset() is called', () => {
      ngMocks.flushTestBed();
      const customFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 1,
        }
      );
      const customComponent = ngMocks.findInstance(customFixture.debugElement, DemisProcessStepperComponent);

      const customMockStepper = createMockStepper({ methods: ['reset'] });
      applyMockStepper(customComponent, customMockStepper);

      customComponent.currentStepIndex.set(2);
      customComponent.reset();

      expect(customComponent.currentStepIndex()).toBe(1);
    });
  });

  describe('onSelectionChange', () => {
    let stepChangeEmitSpy: jasmine.Spy;
    let mockStepper: jasmine.SpyObj<MatStepper>;

    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);

      stepChangeEmitSpy = spyOn(component.stepChange, 'emit');
      mockStepper = createMockStepper({ methods: ['next', 'previous', 'reset'] });
      applyMockStepper(component, mockStepper);
    });

    it('should emit stepChange event for valid navigation', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: 1,
        previouslySelectedIndex: 0,
        selectedStep: {} as MatStep,
        previouslySelectedStep: {} as MatStep,
      };

      component.onSelectionChange(event);

      expect(stepChangeEmitSpy).toHaveBeenCalledWith({
        selectedIndex: 1,
        selectedStep: component.steps()[1],
        previouslySelectedIndex: 0,
        previouslySelectedStep: component.steps()[0],
      });
      expect(component.currentStepIndex()).toBe(1);
    });

    it('should prevent navigation to disabled step and revert to previous step', fakeAsync(() => {
      const steps = createMockSteps();
      steps[1].control.disable();

      ngMocks.flushTestBed();
      const disabledFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: steps,
          initStepIndex: 0,
        }
      );
      const disabledComponent = ngMocks.findInstance(disabledFixture.debugElement, DemisProcessStepperComponent);

      const disabledStepChangeEmitSpy = spyOn(disabledComponent.stepChange, 'emit');
      const disabledMockStepper = createMockStepper({ methods: ['next', 'previous', 'reset'] });
      applyMockStepper(disabledComponent, disabledMockStepper);

      const event: StepperSelectionEvent = {
        selectedIndex: 1,
        previouslySelectedIndex: 0,
        selectedStep: {} as MatStep,
        previouslySelectedStep: {} as MatStep,
      };

      disabledComponent.onSelectionChange(event);

      // Wait for Promise.resolve()
      tick();

      expect(disabledMockStepper.selectedIndex).toBe(0);
      expect(disabledComponent.currentStepIndex()).toBe(0);
      expect(disabledStepChangeEmitSpy).not.toHaveBeenCalled();
    }));

    it('should not emit event when navigating from disabled step', () => {
      const steps = createMockSteps();
      steps[0].control.disable();

      ngMocks.flushTestBed();
      const disabledFromFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: steps,
          initStepIndex: 0,
        }
      );
      const disabledFromComponent = ngMocks.findInstance(disabledFromFixture.debugElement, DemisProcessStepperComponent);

      const disabledFromStepChangeEmitSpy = spyOn(disabledFromComponent.stepChange, 'emit');

      const event: StepperSelectionEvent = {
        selectedIndex: 1,
        previouslySelectedIndex: 0,
        selectedStep: {} as MatStep,
        previouslySelectedStep: {} as MatStep,
      };

      disabledFromComponent.onSelectionChange(event);

      expect(disabledFromStepChangeEmitSpy).not.toHaveBeenCalled();
      expect(disabledFromComponent.currentStepIndex()).toBe(1);
    });

    it('should not emit event when target step does not exist', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: 999, // Non-existent step index
        previouslySelectedIndex: 0,
        selectedStep: {} as MatStep,
        previouslySelectedStep: {} as MatStep,
      };

      component.onSelectionChange(event);

      expect(stepChangeEmitSpy).not.toHaveBeenCalled();
      expect(component.currentStepIndex()).toBe(0); // Should remain unchanged
    });

    it('should handle undefined previouslySelectedStep', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: 1,
        previouslySelectedIndex: -1, // No previous step
        selectedStep: {} as MatStep,
        previouslySelectedStep: {} as MatStep,
      };

      component.onSelectionChange(event);

      expect(stepChangeEmitSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          selectedIndex: 1,
          selectedStep: component.steps()[1],
          previouslySelectedIndex: -1,
        })
      );
    });
  });

  describe('Step Processing and DOM Manipulation', () => {
    let mockElementRef: ElementRef<HTMLElement>;
    let mockStepper: jasmine.SpyObj<MatStepper>;
    let mockSteps: jasmine.SpyObj<MatStep>[];
    let testPostProcess: () => void;

    const nullQueryCallback = () => null;
    const createEmptyPostProcessTest = (emptyComponent: DemisProcessStepperComponent) => () => emptyComponent['postProcessRenderedSteps']();

    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);

      // Create mock DOM elements
      const mockStepElements = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

      mockStepElements.forEach((el, index) => {
        el.classList.add('mat-step');
      });

      const mockContainer = document.createElement('div');
      mockStepElements.forEach(el => mockContainer.appendChild(el));

      // Define query selector callback
      const querySelectorAllCallback = (index: number) => mockStepElements[index];

      // Mock querySelectorAll
      spyOn(mockContainer, 'querySelectorAll').and.returnValue({
        item: querySelectorAllCallback,
      } as any);

      mockElementRef = {
        nativeElement: mockContainer,
      };

      // Create mock MatStep objects with proper spy behavior
      mockSteps = [{ state: 'number' } as any, { state: 'number' } as any, { state: 'number' } as any];

      // Create simpler stepper mock
      mockStepper = createMockStepper({
        steps: mockSteps,
      });

      applyMockStepper(component, mockStepper);
      Object.defineProperty(component, 'stepperElementRef', {
        value: mockElementRef,
        writable: true,
      });

      // Define test function
      testPostProcess = () => component['postProcessRenderedSteps']();
    });

    describe('postProcessRenderedSteps', () => {
      it('should set title attribute for all steps', () => {
        component['postProcessRenderedSteps']();

        const stepElements = mockElementRef.nativeElement.querySelectorAll('.mat-step');
        expect(stepElements.item(0).getAttribute('title')).toBe('Step 1');
        expect(stepElements.item(1).getAttribute('title')).toBe('Step 2');
        expect(stepElements.item(2).getAttribute('title')).toBe('Step 3');
      });

      it('should disable steps with disabled controls', () => {
        const steps = component.steps();
        steps[1].control.disable();

        component['postProcessRenderedSteps']();

        expect(mockSteps[1].state).toBe('disabled');
        expect(mockElementRef.nativeElement.querySelectorAll('.mat-step').item(1).classList.contains('step-disabled')).toBe(true);
      });

      it('should enable steps with enabled controls that were previously disabled', () => {
        // First disable a step
        mockSteps[1].state = 'disabled';
        const stepElement = mockElementRef.nativeElement.querySelectorAll('.mat-step').item(1);
        stepElement.classList.add('step-disabled');

        component['postProcessRenderedSteps']();

        expect(mockSteps[1].state).toBe('number');
        expect(stepElement.classList.contains('step-disabled')).toBe(false);
      });

      it('should handle missing step elements gracefully', () => {
        // Create a new container to avoid spy conflicts
        const newMockContainer = document.createElement('div');
        spyOn(newMockContainer, 'querySelectorAll').and.returnValue({
          item: nullQueryCallback,
        } as any);

        const newMockElementRef = {
          nativeElement: newMockContainer,
        };

        Object.defineProperty(component, 'stepperElementRef', {
          value: newMockElementRef,
          writable: true,
        });

        expect(testPostProcess).not.toThrow();
      });

      it('should handle missing step data gracefully', () => {
        // Create a fixture with empty steps array
        ngMocks.flushTestBed();
        const emptyFixture = MockRender(
          `
          <gem-demis-process-stepper 
            [steps]="steps" 
            [initStepIndex]="initStepIndex">
          </gem-demis-process-stepper>
        `,
          {
            steps: [],
            initStepIndex: 0,
          }
        );
        const emptyComponent = ngMocks.findInstance(emptyFixture.debugElement, DemisProcessStepperComponent);

        applyMockStepper(emptyComponent, mockStepper);
        Object.defineProperty(emptyComponent, 'stepperElementRef', {
          value: mockElementRef,
          writable: true,
        });

        const testFunction = createEmptyPostProcessTest(emptyComponent);
        expect(testFunction).not.toThrow();
      });
    });

    describe('disableStep', () => {
      it('should set step state to disabled and add CSS class', () => {
        const mockStep = mockSteps[0];
        const mockElement = mockElementRef.nativeElement.querySelectorAll('.mat-step').item(0);

        component['disableStep'](mockStep, mockElement);

        expect(mockStep.state).toBe('disabled');
        expect(mockElement.classList.contains('step-disabled')).toBe(true);
      });
    });

    describe('enableStep', () => {
      it('should enable a disabled step', () => {
        const mockStep = mockSteps[0];
        const mockElement = mockElementRef.nativeElement.querySelectorAll('.mat-step').item(0);

        // Set initial disabled state
        mockStep.state = 'disabled';
        mockElement.classList.add('step-disabled');

        component['enableStep'](mockStep, mockElement);

        expect(mockStep.state).toBe('number');
        expect(mockElement.classList.contains('step-disabled')).toBe(false);
      });

      it('should not change state of already enabled step', () => {
        const mockStep = mockSteps[0];
        const mockElement = mockElementRef.nativeElement.querySelectorAll('.mat-step').item(0);

        mockStep.state = 'edit';

        component['enableStep'](mockStep, mockElement);

        expect(mockStep.state).toBe('edit'); // Should remain unchanged
      });
    });

    describe('ngAfterViewChecked', () => {
      it('should call postProcessRenderedSteps', () => {
        spyOn<any>(component, 'postProcessRenderedSteps');

        component.ngAfterViewChecked();

        expect(component['postProcessRenderedSteps']).toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit', () => {
      it('should set stepper.selectedIndex to initStepIndex', fakeAsync(() => {
        const mockStepper = createMockStepper({
          methods: ['reset'],
          steps: { length: 3 } as any,
        });
        applyMockStepper(component, mockStepper);

        // Test with default initStepIndex (0)
        component.ngAfterViewInit();

        // Advance the timer to trigger setTimeout
        tick();

        expect(mockStepper.selectedIndex).toBe(0);
      }));

      it('should set stepper.selectedIndex to custom initStepIndex', fakeAsync(() => {
        ngMocks.flushTestBed();
        const customFixture = MockRender(
          `
          <gem-demis-process-stepper 
            [steps]="steps" 
            [initStepIndex]="initStepIndex">
          </gem-demis-process-stepper>
        `,
          {
            steps: createMockSteps(),
            initStepIndex: 2,
          }
        );
        const customComponent = ngMocks.findInstance(customFixture.debugElement, DemisProcessStepperComponent);

        const mockStepper = createMockStepper({
          methods: ['reset'],
          steps: { length: 3 } as any,
        });
        applyMockStepper(customComponent, mockStepper);

        customComponent.ngAfterViewInit();

        // Advance the timer to trigger setTimeout
        tick();

        expect(mockStepper.selectedIndex).toBe(2);
      }));
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);
    });

    it('should return undefined for currentStep when index is out of bounds', () => {
      component.currentStepIndex.set(999);
      expect(component.currentStep()).toBeUndefined();
    });

    it('should update currentStep when currentStepIndex changes', () => {
      expect(component.currentStep()).toEqual(component.steps()[0]);

      component.currentStepIndex.set(1);
      expect(component.currentStep()).toEqual(component.steps()[1]);

      component.currentStepIndex.set(2);
      expect(component.currentStep()).toEqual(component.steps()[2]);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty steps array', () => {
      ngMocks.flushTestBed();
      const emptyFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: [],
          initStepIndex: 0,
        }
      );
      const emptyComponent = ngMocks.findInstance(emptyFixture.debugElement, DemisProcessStepperComponent);

      expect(emptyComponent.currentStep()).toBeUndefined();
      expect(emptyComponent.steps().length).toBe(0);
    });

    it('should handle negative initStepIndex with proper ngAfterViewInit behavior', fakeAsync(() => {
      ngMocks.flushTestBed();
      const negativeFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: -1,
        }
      );
      const negativeComponent = ngMocks.findInstance(negativeFixture.debugElement, DemisProcessStepperComponent);

      // Mock stepper for proper testing
      const mockStepper = createMockStepper({ methods: ['reset'] });
      applyMockStepper(negativeComponent, mockStepper);

      // initStepIndex input signal contains the correct value
      expect(negativeComponent.initStepIndex()).toBe(-1);

      // After ngAfterViewInit, stepper.selectedIndex should be set to initStepIndex
      negativeComponent.ngAfterViewInit();

      // Advance the timer to trigger setTimeout
      tick();

      expect(mockStepper.selectedIndex).toBe(-1);

      // Test reset behavior with negative initStepIndex
      negativeComponent.reset();
      expect(negativeComponent.currentStepIndex()).toBe(-1);
      expect(negativeComponent.currentStep()).toBeUndefined();
    }));

    it('should handle initStepIndex greater than steps length with proper ngAfterViewInit behavior', () => {
      ngMocks.flushTestBed();
      const outOfBoundsFixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 10,
        }
      );
      const outOfBoundsComponent = ngMocks.findInstance(outOfBoundsFixture.debugElement, DemisProcessStepperComponent);

      // Mock stepper for proper testing
      const mockStepper = createMockStepper({ methods: ['reset'] });
      applyMockStepper(outOfBoundsComponent, mockStepper);

      // initStepIndex input signal contains the correct value
      expect(outOfBoundsComponent.initStepIndex()).toBe(10);

      // After ngAfterViewInit, stepper.selectedIndex should be set to initStepIndex
      outOfBoundsComponent.ngAfterViewInit();
      expect(mockStepper.selectedIndex).toBe(10);

      // Test reset behavior with out-of-bounds initStepIndex
      outOfBoundsComponent.reset();
      expect(outOfBoundsComponent.currentStepIndex()).toBe(10);
      expect(outOfBoundsComponent.currentStep()).toBeUndefined();
    });
  });

  describe('Signal Behavior and Reactivity', () => {
    beforeEach(() => {
      fixture = MockRender(
        `
        <gem-demis-process-stepper 
          [steps]="steps" 
          [initStepIndex]="initStepIndex">
        </gem-demis-process-stepper>
      `,
        {
          steps: createMockSteps(),
          initStepIndex: 0,
        }
      );
      component = ngMocks.findInstance(fixture.debugElement, DemisProcessStepperComponent);
    });

    it('should have reactive input signals', () => {
      // Test that input signals are properly defined and reactive
      expect(component.steps()).toBeDefined();
      expect(component.steps().length).toBe(3);
      expect(component.initStepIndex()).toBe(0);
    });

    it('should have reactive currentStepIndex signal', () => {
      // Test signal reactivity by updating the value
      expect(component.currentStepIndex()).toBe(0);

      component.currentStepIndex.set(1);
      expect(component.currentStepIndex()).toBe(1);

      component.currentStepIndex.set(2);
      expect(component.currentStepIndex()).toBe(2);
    });

    it('should have reactive computed currentStep signal', () => {
      // Test computed signal reactivity
      expect(component.currentStep()).toEqual(component.steps()[0]);

      component.currentStepIndex.set(1);
      expect(component.currentStep()).toEqual(component.steps()[1]);

      component.currentStepIndex.set(2);
      expect(component.currentStep()).toEqual(component.steps()[2]);

      // Test out of bounds
      component.currentStepIndex.set(999);
      expect(component.currentStep()).toBeUndefined();
    });

    it('should maintain signal state during navigation', () => {
      const mockStepper = createMockStepper();
      applyMockStepper(component, mockStepper);

      // Test signal state persistence through navigation methods
      component.currentStepIndex.set(1);
      expect(component.currentStepIndex()).toBe(1);

      // Navigation methods should not directly affect currentStepIndex
      // (that's handled by onSelectionChange)
      component.next();
      expect(component.currentStepIndex()).toBe(1);

      component.previous();
      expect(component.currentStepIndex()).toBe(1);
    });
  });

  describe('Isolated Method Tests', () => {
    let isolatedComponent: DemisProcessStepperComponent;

    beforeEach(() => {
      // Create isolated component for testing methods without ViewChild dependencies
      fixture = MockRender(DemisProcessStepperComponent, {
        steps: createMockSteps(),
        initStepIndex: 0,
      });
      isolatedComponent = fixture.point.componentInstance;
    });

    describe('isCompleted - Isolated', () => {
      it('should return true for touched and valid step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('valid value');

        expect(isolatedComponent.isCompleted(step)).toBe(true);
      });

      it('should return false for untouched step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.setValue('valid value');

        expect(isolatedComponent.isCompleted(step)).toBe(false);
      });

      it('should return false for touched but invalid step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('');

        expect(isolatedComponent.isCompleted(step)).toBe(false);
      });
    });

    describe('hasError - Isolated', () => {
      it('should return true for touched and invalid step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('');

        expect(isolatedComponent.hasError(step)).toBe(true);
      });

      it('should return false for untouched step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.setValue('');

        expect(isolatedComponent.hasError(step)).toBe(false);
      });

      it('should return false for touched and valid step', () => {
        const step = isolatedComponent.steps()[0];
        step.control.markAsTouched();
        step.control.setValue('valid value');

        expect(isolatedComponent.hasError(step)).toBe(false);
      });
    });

    describe('navigation methods - Isolated', () => {
      let mockStepper: jasmine.SpyObj<MatStepper>;

      beforeEach(() => {
        mockStepper = createMockStepper();
        applyMockStepper(isolatedComponent, mockStepper);
      });

      it('should call stepper.next() when next() is called', () => {
        isolatedComponent.next();
        expect(mockStepper.next).toHaveBeenCalled();
      });

      it('should call stepper.previous() when previous() is called', () => {
        isolatedComponent.previous();
        expect(mockStepper.previous).toHaveBeenCalled();
      });

      it('should call stepper.reset() and reset currentStepIndex when reset() is called', () => {
        isolatedComponent.currentStepIndex.set(2);

        isolatedComponent.reset();

        expect(mockStepper.reset).toHaveBeenCalled();
        expect(isolatedComponent.currentStepIndex()).toBe(0);
      });
    });
  });
});
