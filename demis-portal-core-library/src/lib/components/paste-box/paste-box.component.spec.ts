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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockBuilder, MockProvider } from 'ng-mocks';
import { MessageDialogService } from '../../services/message-dialog.service';
import { DEMIS_PASTE_BOX_CLIPBOARD_ERROR, PasteBoxComponent } from './paste-box.component';
import { NGXLogger } from 'ngx-logger';

describe('PasteBoxComponent', () => {
  let component: PasteBoxComponent;
  let fixture: ComponentFixture<PasteBoxComponent>;

  beforeEach(() =>
    MockBuilder([PasteBoxComponent, MatButtonModule, MatIconModule]).provide(MockProvider(MessageDialogService)).provide(MockProvider(NGXLogger))
  );

  beforeEach(async () => {
    fixture = TestBed.createComponent(PasteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dataPasted event when clipboard text is read and parsed successfully', async () => {
    const clipboardText = 'URL P.family=Schulz&P.given=Klaus';
    const expectedParsedClipboardData = new Map<string, string>([
      ['P.family', 'Schulz'],
      ['P.given', 'Klaus'],
    ]);
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  });

  it('should emit dataPasted event when encoded clipboard text is read and parsed successfully', async () => {
    const clipboardText = 'URL F.name=ACME%20Corp.&F.bsnr=4711&F.type=1&F.street=Stairway%20To%20Heaven&F.houseNumber=911&F.zip=0815&F.city=Duckburg';
    const expectedParsedClipboardData = new Map<string, string>([
      ['F.name', 'ACME Corp.'],
      ['F.bsnr', '4711'],
      ['F.type', '1'],
      ['F.street', 'Stairway To Heaven'],
      ['F.houseNumber', '911'],
      ['F.zip', '0815'],
      ['F.city', 'Duckburg'],
    ]);
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  });

  it('should emit dataPasted event when fully encoded clipboard text is read and parsed successfully', async () => {
    const clipboardText =
      'URL F.name%3DACME%20Corp.%26F.bsnr%3D4711%26F.type%3D1%26F.street%3DStairway%20To%20Heaven%26F.houseNumber%3D911%26F.zip%3D0815%26F.city%3DDuckburg';
    const expectedParsedClipboardData = new Map<string, string>([
      ['F.name', 'ACME Corp.'],
      ['F.bsnr', '4711'],
      ['F.type', '1'],
      ['F.street', 'Stairway To Heaven'],
      ['F.houseNumber', '911'],
      ['F.zip', '0815'],
      ['F.city', 'Duckburg'],
    ]);
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  });

  it('should call showErrorDialog when clipboard text is read successfully, but cannot be parsed', async () => {
    const clipboardText = 'URL not_parsable_data';
    const showErrorDialogSpy = vi.spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  });

  it('should call showErrorDialog when clipboard text is empty', async () => {
    const clipboardText = '';
    const showErrorDialogSpy = vi.spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  });

  it('should call showErrorDialog when clipboard read fails', async () => {
    const showErrorDialogSpy = vi.spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    const error = new Error('Clipboard read failed');
    vi.spyOn(navigator.clipboard, 'readText').mockRejectedValue(error);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).not.toHaveBeenCalled();
    expect(showErrorDialogSpy).toHaveBeenCalledWith(DEMIS_PASTE_BOX_CLIPBOARD_ERROR);
  });

  it('should trim key and value when parsing clipboard data with newline after &', async () => {
    const clipboardText = 'URL  key1 = value1  &\n  key2=  value2 ';
    const expectedParsedClipboardData = new Map<string, string>([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(clipboardText);
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(component.dataPasted, 'emit');

    component.readFromClipboard();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.dataPasted.emit).toHaveBeenCalledWith(expectedParsedClipboardData);
  });

  describe('Accessibility (WCAG)', () => {
    it('should expose the paste box as a named landmark region (WCAG 1.3.1, 2.4.1)', () => {
      const region: HTMLElement = fixture.nativeElement.querySelector('[role="region"]');
      expect(region).toBeTruthy();

      const labelledBy = region.getAttribute('aria-labelledby');
      expect(labelledBy).toBe('paste-box-title');

      const title = fixture.nativeElement.querySelector(`#${labelledBy}`);
      expect(title).toBeTruthy();
      expect(title.textContent?.trim()).toBe('Datenübernahme');
    });

    it('should render a polite, atomic live region for status messages (WCAG 4.1.3)', () => {
      const status: HTMLElement = fixture.nativeElement.querySelector('#paste-status');
      expect(status).toBeTruthy();
      expect(status.getAttribute('aria-live')).toBe('polite');
      expect(status.getAttribute('aria-atomic')).toBe('true');
    });

    it('should associate the button with the status live region via aria-describedby', () => {
      const button: HTMLElement = fixture.nativeElement.querySelector('#btn-fill-form');
      expect(button.getAttribute('aria-describedby')).toBe('paste-status');
    });

    it('should start with an empty status message', () => {
      expect(component.pasteStatus()).toBe('');
      const status: HTMLElement = fixture.nativeElement.querySelector('#paste-status');
      expect(status.textContent?.trim()).toBe('');
    });

    it('should announce success in the live region after a successful paste (WCAG 4.1.3)', async () => {
      vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue('URL P.family=Schulz');
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      component.readFromClipboard();
      await new Promise(resolve => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.pasteStatus()).toBe('Inhalt eingefügt!');
      const status: HTMLElement = fixture.nativeElement.querySelector('#paste-status');
      expect(status.textContent?.trim()).toBe('Inhalt eingefügt!');
    });

    it('should announce an error in the live region when clipboard read fails (WCAG 4.1.3)', async () => {
      vi.spyOn(navigator.clipboard, 'readText').mockRejectedValue(new Error('denied'));
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      component.readFromClipboard();
      await new Promise(resolve => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.pasteStatus()).toBe('Fehler bei der Datenübernahme.');
      const status: HTMLElement = fixture.nativeElement.querySelector('#paste-status');
      expect(status.textContent?.trim()).toBe('Fehler bei der Datenübernahme.');
    });

    it('should announce an error in the live region when clipboard content is not parsable (WCAG 4.1.3)', async () => {
      vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue('URL not_parsable_data');
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      component.readFromClipboard();
      await new Promise(resolve => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.pasteStatus()).toBe('Fehler bei der Datenübernahme.');
    });

    it('should provide an accessible name for the button (WCAG 4.1.2)', () => {
      const button: HTMLElement = fixture.nativeElement.querySelector('#btn-fill-form');
      expect(button.getAttribute('aria-label')).toBe('Zwischenablage einfügen');
    });
  });
});
