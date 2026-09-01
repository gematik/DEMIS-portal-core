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

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { signal, type Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { StepNavigationService } from './step-navigation.service';
import { DemisProcessStepperComponent, ProcessStep } from '../components/process-stepper/process-stepper.component';

describe('StepNavigationService', () => {
  let service: StepNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StepNavigationService],
    });
    service = TestBed.inject(StepNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFocusableElements', () => {
    it('should return focusable elements within the provided container', () => {
      const container = document.createElement('main');
      container.innerHTML = `
        <a href="/next">Next</a>
        <input>
        <button disabled>Disabled</button>
        <div tabindex="0">Material-like control</div>
        <div aria-hidden="true"><button>Hidden</button></div>
      `;
      document.body.appendChild(container);

      expect(service.getFocusableElements(container)).toEqual([
        container.querySelector('a'),
        container.querySelector('input'),
        container.querySelector('[tabindex="0"]'),
      ]);

      container.remove();
    });

    it('should return an empty list for a container without focusable elements', () => {
      expect(service.getFocusableElements(document.createElement('main'))).toEqual([]);
    });
  });

  describe('before stepper registration', () => {
    it('should return false for canGoToNext', () => {
      expect(service.canGoToNext()).toBe(false);
    });

    it('should return false for canGoToPrevious', () => {
      expect(service.canGoToPrevious()).toBe(false);
    });

    it('should return 0 for currentStepIndex', () => {
      expect(service.currentStepIndex()).toBe(0);
    });

    it('should return undefined for currentStep', () => {
      expect(service.currentStep()).toBeUndefined();
    });

    it('should not throw on next()', () => {
      expect(() => service.next()).not.toThrow();
    });

    it('should not throw on previous()', () => {
      expect(() => service.previous()).not.toThrow();
    });

    it('should not throw on reset()', () => {
      expect(() => service.reset()).not.toThrow();
    });

    it('should not throw on goToStep()', () => {
      expect(() => service.goToStep(0)).not.toThrow();
    });

    it('should not throw on goToStepByKey()', () => {
      expect(() => service.goToStepByKey('test')).not.toThrow();
    });
  });

  describe('after stepper registration', () => {
    let mockStepper: {
      next: Mock;
      previous: Mock;
      reset: Mock;
      goToStep: Mock;
      goToStepByKey: Mock;
      canGoToNext: Signal<boolean>;
      canGoToPrevious: Signal<boolean>;
      currentStepIndex: Signal<number>;
      currentStep: Signal<ProcessStep | undefined>;
    };
    const mockStep: ProcessStep = { key: 'step-3', label: 'Step 3', control: new FormControl() };

    beforeEach(() => {
      mockStepper = {
        next: vi.fn().mockName('DemisProcessStepperComponent.next'),
        previous: vi.fn().mockName('DemisProcessStepperComponent.previous'),
        reset: vi.fn().mockName('DemisProcessStepperComponent.reset'),
        goToStep: vi.fn().mockName('DemisProcessStepperComponent.goToStep'),
        goToStepByKey: vi.fn().mockName('DemisProcessStepperComponent.goToStepByKey'),
        canGoToNext: signal(true),
        canGoToPrevious: signal(false),
        currentStepIndex: signal(2),
        currentStep: signal(mockStep),
      };

      service.registerStepper(mockStepper as unknown as DemisProcessStepperComponent);
    });

    it('should delegate canGoToNext to stepper', () => {
      expect(service.canGoToNext()).toBe(true);
    });

    it('should delegate canGoToPrevious to stepper', () => {
      expect(service.canGoToPrevious()).toBe(false);
    });

    it('should delegate currentStepIndex to stepper', () => {
      expect(service.currentStepIndex()).toBe(2);
    });

    it('should delegate currentStep to stepper', () => {
      expect(service.currentStep()).toEqual(mockStep);
    });

    it('should delegate next() to stepper', () => {
      service.next();
      expect(mockStepper.next).toHaveBeenCalledTimes(1);
    });

    it('should delegate previous() to stepper', () => {
      service.previous();
      expect(mockStepper.previous).toHaveBeenCalledTimes(1);
    });

    it('should delegate reset() to stepper', () => {
      service.reset();
      expect(mockStepper.reset).toHaveBeenCalledTimes(1);
    });

    it('should delegate goToStep() to stepper', () => {
      service.goToStep(3);
      expect(mockStepper.goToStep).toHaveBeenCalledWith(3, true);
    });

    it('should delegate goToStepByKey() to stepper', () => {
      service.goToStepByKey('result');
      expect(mockStepper.goToStepByKey).toHaveBeenCalledWith('result', true);
    });
  });

  describe('stepper re-registration', () => {
    it('should use the latest registered stepper', () => {
      const firstStepper = {
        next: vi.fn().mockName('first.next'),
        canGoToNext: signal(false),
        canGoToPrevious: signal(false),
        currentStepIndex: signal(0),
        currentStep: signal(undefined),
      };
      const secondStepper = {
        next: vi.fn().mockName('second.next'),
        canGoToNext: signal(true),
        canGoToPrevious: signal(false),
        currentStepIndex: signal(1),
        currentStep: signal(undefined),
      };

      service.registerStepper(firstStepper as unknown as DemisProcessStepperComponent);
      service.registerStepper(secondStepper as unknown as DemisProcessStepperComponent);

      service.next();
      expect(firstStepper.next).not.toHaveBeenCalled();
      expect(secondStepper.next).toHaveBeenCalledTimes(1);
    });
  });
});
