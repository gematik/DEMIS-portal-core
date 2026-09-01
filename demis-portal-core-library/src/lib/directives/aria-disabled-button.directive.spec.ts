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

import { Component } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockBuilder, MockRender } from 'ng-mocks';
import { GemDemisAriaDisabledButtonDirective } from './aria-disabled-button.directive';

@Component({
  template: `
    <button
      class="btn style dark--color"
      type="button"
      [gemDemisAriaDisabled]="isDisabled"
      [gemDemisAriaDisabledDescribedBy]="descriptionId"
      (click)="onAction()"
      (gemDemisActivationBlocked)="onBlocked()">
      Submit
    </button>
  `,
  standalone: false,
})
class TestComponent {
  isDisabled = false;
  descriptionId = 'validation-summary';
  onAction = vi.fn();
  onBlocked = vi.fn();
}

describe('GemDemisAriaDisabledButtonDirective', () => {
  beforeEach(() => MockBuilder(TestComponent).keep(GemDemisAriaDisabledButtonDirective));

  it('keeps an ARIA-disabled button in the tab order and references its description', () => {
    const fixture = MockRender(TestComponent);
    fixture.point.componentInstance.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-describedby')).toBe('validation-summary');
    expect(button.getAttribute('tabindex')).toBe('0');
    expect(button.style.backgroundColor).toBe('rgb(217, 217, 217)');
    expect(button.style.getPropertyPriority('background-color')).toBe('important');
    expect(button.style.color).toBe('rgb(89, 89, 89)');
    expect(button.style.getPropertyPriority('color')).toBe('important');
    expect(button.style.cursor).toBe('not-allowed');
    expect(button.style.fontStyle).toBe('normal');
    expect(button.style.fontWeight).toBe('400');
    expect(button.style.lineHeight).toBe('22px');
  });

  it('prevents an action and emits a blocked activation when ARIA-disabled', () => {
    const fixture = MockRender(TestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(component.onAction).not.toHaveBeenCalled();
    expect(component.onBlocked).toHaveBeenCalledOnce();
  });

  it('allows an action when enabled', () => {
    const fixture = MockRender(TestComponent);
    const component = fixture.point.componentInstance;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(component.onAction).toHaveBeenCalledOnce();
    expect(component.onBlocked).not.toHaveBeenCalled();
  });

  it('prevents Enter and Space keydown while ARIA-disabled', () => {
    const fixture = MockRender(TestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    button.dispatchEvent(enterEvent);
    expect(enterEvent.defaultPrevented).toBe(true);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    button.dispatchEvent(spaceEvent);
    expect(spaceEvent.defaultPrevented).toBe(true);
  });

  it('does not prevent other keydowns while ARIA-disabled', () => {
    const fixture = MockRender(TestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    button.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(false);
  });

  it('does not prevent Enter keydown when enabled', () => {
    const fixture = MockRender(TestComponent);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    button.dispatchEvent(enterEvent);
    expect(enterEvent.defaultPrevented).toBe(false);
  });
});

@Component({
  template: `
    <button class="btn style dark--color" type="submit" [gemDemisAriaDisabled]="isDisabled" [gemDemisAriaDisabledDescribedBy]="descriptionId">Submit</button>
  `,
  standalone: false,
})
class SubmitTestComponent {
  isDisabled = false;
  descriptionId: string | undefined;
}

describe('GemDemisAriaDisabledButtonDirective on a submit button', () => {
  beforeEach(() => MockBuilder(SubmitTestComponent).keep(GemDemisAriaDisabledButtonDirective));

  it('announces that submitting is currently not possible when ARIA-disabled, without a second directive import', () => {
    const fixture = MockRender(SubmitTestComponent);
    fixture.point.componentInstance.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const describedByIds = button.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedByIds).toHaveLength(1);
    const announcement = document.getElementById(describedByIds[0]);
    expect(announcement?.textContent).toBe(
      'Abschicken derzeit nicht möglich. Bitte prüfen Sie das Formular auf Validierungsfehler oder nicht begonnene Schritte.'
    );
  });

  it('clears the announcement text once the button becomes available again', () => {
    const fixture = MockRender(SubmitTestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const announcementId = button.getAttribute('aria-describedby') as string;

    component.isDisabled = false;
    fixture.detectChanges();

    expect(document.getElementById(announcementId)?.textContent).toBe('');
  });

  it('merges its announcement id with a consumer-provided aria-describedby id', () => {
    const fixture = MockRender(SubmitTestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    component.descriptionId = 'consumer-hint';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-describedby')).toContain('consumer-hint');
  });
});

@Component({
  template: `
    <button class="btn style dark--color" type="button" style="color: red !important; background-color: blue;" [gemDemisAriaDisabled]="isDisabled">
      Submit
    </button>
  `,
  standalone: false,
})
class PreStyledTestComponent {
  isDisabled = false;
}

describe('GemDemisAriaDisabledButtonDirective with pre-existing inline styles', () => {
  beforeEach(() => MockBuilder(PreStyledTestComponent).keep(GemDemisAriaDisabledButtonDirective));

  it('restores the original inline styles, including !important priority, once re-enabled', () => {
    const fixture = MockRender(PreStyledTestComponent);
    const component = fixture.point.componentInstance;
    component.isDisabled = true;
    fixture.detectChanges();

    component.isDisabled = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.color).toBe('red');
    expect(button.style.getPropertyPriority('color')).toBe('important');
    expect(button.style.backgroundColor).toBe('blue');
    expect(button.style.getPropertyPriority('background-color')).toBe('');
  });

  it('does not recapture already-saved initial styles when disabled repeatedly', () => {
    const fixture = MockRender(PreStyledTestComponent);
    const component = fixture.point.componentInstance;

    component.isDisabled = true;
    fixture.detectChanges();
    component.isDisabled = false;
    fixture.detectChanges();
    component.isDisabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.color).toBe('rgb(89, 89, 89)');

    component.isDisabled = false;
    fixture.detectChanges();

    expect(button.style.color).toBe('red');
    expect(button.style.getPropertyPriority('color')).toBe('important');
  });
});
