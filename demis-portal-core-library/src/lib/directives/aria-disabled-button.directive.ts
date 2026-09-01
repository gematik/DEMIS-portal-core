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

import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, computed, effect, inject, input, output } from '@angular/core';

const SUBMIT_ANNOUNCEMENT_TEXT = 'Abschicken derzeit nicht möglich. Bitte prüfen Sie das Formular auf Validierungsfehler oder nicht begonnene Schritte.';

let uniqueSubmitAnnouncementId = 0;

@Directive({
  /**
   * This directive is applied to a button element to make it ARIA-disabled while keeping it in the tab order.
   *
   * **BEWARE!!** For now, we restrict it to work with buttons that have the class "btn style dark--color", hence, our primary buttons.
   * Once we have all the styles for all button types (most likely in portal-theme), we can remove this restriction and make it work for all buttons.
   *
   * The directive also adds an ARIA description to the button, which can be provided via the `gemDemisAriaDisabledDescribedBy` input.
   * If the button is a submit button, it will also add a hidden announcement element to inform users that the form cannot be submitted due to validation errors.
   */
  selector: 'button.btn.style.dark--color[gemDemisAriaDisabled]',
  standalone: true,
  host: {
    '[attr.aria-disabled]': 'gemDemisAriaDisabled() ? "true" : "false"',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.tabindex]': 'gemDemisAriaDisabled() ? 0 : null',
    '[style.cursor]': 'gemDemisAriaDisabled() ? "not-allowed" : null',
  },
})
export class GemDemisAriaDisabledButtonDirective implements OnInit, OnDestroy {
  private readonly hostElement = inject(ElementRef<HTMLButtonElement>);
  private readonly renderer = inject(Renderer2);
  private readonly abortController = new AbortController();
  private readonly disabledStyles = new Map([
    ['background-color', '#D9D9D9'],
    ['color', '#595959'],
    ['font-style', 'normal'],
    ['font-weight', '400'],
    ['line-height', '22px'],
  ]);
  private readonly initialInlineStyles = new Map<string, { value: string; priority: string }>();

  readonly gemDemisAriaDisabled = input(false);
  readonly gemDemisAriaDisabledDescribedBy = input<string>();
  readonly gemDemisActivationBlocked = output<void>();
  private readonly disabledStyleEffect = effect(() => this.updateDisabledStyles());

  /**
   * A submit button gets its own hidden announcement so the fixed explanation is always
   * available, without requiring a second directive import on the button.
   */
  private readonly submitAnnouncementId = `gem-demis-aria-disabled-submit-announcement-${++uniqueSubmitAnnouncementId}`;
  private isSubmitButton = false;
  private submitAnnouncementElement: HTMLElement | null = null;
  private readonly submitAnnouncementEffect = effect(() => this.updateSubmitAnnouncementText(this.gemDemisAriaDisabled()));

  protected readonly describedBy = computed(() => {
    const submitDescribedBy = this.gemDemisAriaDisabled() ? this.submitAnnouncementId : null;
    const ids = [this.gemDemisAriaDisabledDescribedBy(), this.isSubmitButton ? submitDescribedBy : null].filter((id): id is string => !!id);
    return ids.length ? ids.join(' ') : null;
  });

  ngOnInit(): void {
    this.hostElement.nativeElement.addEventListener('click', this.onClick, { capture: true, signal: this.abortController.signal });
    this.hostElement.nativeElement.addEventListener('keydown', this.onKeydown, { capture: true, signal: this.abortController.signal });

    this.isSubmitButton = this.hostElement.nativeElement.type === 'submit';
    if (this.isSubmitButton) {
      this.createSubmitAnnouncementElement();
      this.updateSubmitAnnouncementText(this.gemDemisAriaDisabled());
    }
  }

  ngOnDestroy(): void {
    this.abortController.abort();
    this.disabledStyleEffect.destroy();
    this.submitAnnouncementEffect.destroy();
    this.restoreInitialInlineStyles();
    if (this.submitAnnouncementElement?.parentNode) {
      this.renderer.removeChild(this.submitAnnouncementElement.parentNode, this.submitAnnouncementElement);
    }
  }

  private createSubmitAnnouncementElement(): void {
    const announcement = this.renderer.createElement('span') as HTMLElement;
    this.renderer.setAttribute(announcement, 'id', this.submitAnnouncementId);
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'width', '1px');
    this.renderer.setStyle(announcement, 'height', '1px');
    this.renderer.setStyle(announcement, 'overflow', 'hidden');
    this.renderer.setStyle(announcement, 'clip', 'rect(0, 0, 0, 0)');
    this.renderer.setStyle(announcement, 'white-space', 'nowrap');
    this.renderer.appendChild(this.hostElement.nativeElement.parentNode, announcement);
    this.submitAnnouncementElement = announcement;
  }

  private updateSubmitAnnouncementText(isDisabled: boolean): void {
    if (!this.submitAnnouncementElement) {
      return;
    }

    this.renderer.setProperty(this.submitAnnouncementElement, 'textContent', isDisabled ? SUBMIT_ANNOUNCEMENT_TEXT : '');
  }

  private updateDisabledStyles(): void {
    if (this.gemDemisAriaDisabled()) {
      this.applyDisabledStyles();
      return;
    }

    this.restoreInitialInlineStyles();
  }

  private applyDisabledStyles(): void {
    const button = this.hostElement.nativeElement;

    this.disabledStyles.forEach((value, property) => {
      if (!this.initialInlineStyles.has(property)) {
        this.initialInlineStyles.set(property, {
          value: button.style.getPropertyValue(property),
          priority: button.style.getPropertyPriority(property),
        });
      }

      this.renderer.setStyle(button, property, value, RendererStyleFlags2.Important);
    });
  }

  private restoreInitialInlineStyles(): void {
    const button = this.hostElement.nativeElement;

    this.initialInlineStyles.forEach(({ value, priority }, property) => {
      if (value) {
        this.renderer.setStyle(button, property, value, priority === 'important' ? RendererStyleFlags2.Important : undefined);
      } else {
        this.renderer.removeStyle(button, property);
      }
    });
  }

  private readonly onClick = (event: MouseEvent): void => {
    if (!this.gemDemisAriaDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    this.gemDemisActivationBlocked.emit();
  };

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (!this.gemDemisAriaDisabled() || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
  };
}
