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

import { Clipboard } from '@angular/cdk/clipboard';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MockBuilder, MockProvider } from 'ng-mocks';
import { ErrorMessage } from '../../services/message-dialog.service';
import { ErrorDialogWithSearchInKbComponent } from './error-dialog-with-search-in-kb.component';

describe('UploadErrorsComponent', () => {
  let component: ErrorDialogWithSearchInKbComponent;
  let fixture: ComponentFixture<ErrorDialogWithSearchInKbComponent>;
  let loader: HarnessLoader;
  let clipboard: Clipboard;
  let router: Router;
  const clipboardContent = 'Test clipboard content';

  describe('Full dialog, no redirect to homepage', () => {
    const text1 = 'First error';
    const text2 = 'Second error';
    const queryString1 = 'Validierungsfehler Metadaten-Upload IGS';
    const queryString2 = 'Validierungsfehler Sequenzdaten-Upload IGS';

    const errorMessages: ErrorMessage[] = [
      { text: text1, queryString: queryString1 },
      { text: text2, queryString: queryString2 },
    ];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, ErrorDialogWithSearchInKbComponent],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              errors: errorMessages,
              clipboardContent: clipboardContent,
            },
          },
          Clipboard,
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ErrorDialogWithSearchInKbComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      clipboard = TestBed.inject(Clipboard);
      spyOn(clipboard, 'copy').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should call onCopyErrors and copy the string to clipboard when button is clicked', async () => {
      spyOn(component, 'onCopyErrors').and.callThrough();

      const button = await loader.getHarness(MatButtonHarness.with({ selector: '#copy-errors-btn' }));
      expect(button).toBeDefined();
      await button.click();

      expect(component.onCopyErrors).toHaveBeenCalled();
      expect(clipboard.copy).toHaveBeenCalledWith(clipboardContent);
    });

    it('should have the correct hrefs for the anchor tags', () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('a'));

      expect(anchorElements.length).toBe(2);

      const firstHref = anchorElements[0].nativeElement.getAttribute('href');
      const secondHref = anchorElements[1].nativeElement.getAttribute('href');

      expect(firstHref).toBe('https://wiki.gematik.de/dosearchsite.action?where=DSKB&queryString=Validierungsfehler%20Metadaten-Upload%20IGS');
      expect(secondHref).toBe('https://wiki.gematik.de/dosearchsite.action?where=DSKB&queryString=Validierungsfehler%20Sequenzdaten-Upload%20IGS');
    });

    it('should have the correct error texts for the anchor tags', async () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('.mat-column-text'));

      //Header also found
      expect(anchorElements.length).toBe(3);

      const firstText = anchorElements[1].nativeElement.textContent;
      const secondText = anchorElements[2].nativeElement.textContent;

      expect(firstText).toBe(text1);
      expect(secondText).toBe(text2);
    });

    it('should have default title', () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('#error-dialog-title'));
      expect(anchorElements.length).toBe(1);
      const text = anchorElements[0].nativeElement.textContent;
      expect(text.trim()).toBe('Aufgetretene Fehler');
    });

    it('check label of close button', () => {
      const closeButtonLabel = component.closeButtonLabel;
      expect(closeButtonLabel).toBe('Schließen');
    });
  });

  describe('Dialog with empty Clipboard, errors without query and custom errorTitle', () => {
    const errorMessages: ErrorMessage[] = [{ text: 'First error' }, { text: 'Second error' }];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, ErrorDialogWithSearchInKbComponent],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              errorTitle: 'OtherTitle',
              errors: errorMessages,
            },
          },
          Clipboard,
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ErrorDialogWithSearchInKbComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      clipboard = TestBed.inject(Clipboard);
      spyOn(clipboard, 'copy').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should have custom title', () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('#error-dialog-title'));
      expect(anchorElements.length).toBe(1);
      const text = anchorElements[0].nativeElement.textContent;
      expect(text.trim()).toBe('OtherTitle');
    });

    it('should have no href', () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('a'));
      expect(anchorElements.length).toBe(0);
    });

    it('should have not copy error button', async () => {
      const button = fixture.debugElement.queryAll(By.css('#copy-errors-btn'));
      expect(button).toEqual([]);
    });
  });

  describe('Dialog with empty Clipboard, errors with query and custom errorTitle', () => {
    const errorMessages: ErrorMessage[] = [
      {
        text: 'First error',
        queryString: 'Validierungsfehler Metadaten-Upload IGS',
      },
      { text: 'Second error' },
    ];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, ErrorDialogWithSearchInKbComponent],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              errors: errorMessages,
            },
          },
          Clipboard,
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ErrorDialogWithSearchInKbComponent);
      component = fixture.componentInstance;
      clipboard = TestBed.inject(Clipboard);
      spyOn(clipboard, 'copy').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should have the correct href for the anchor tag', () => {
      const anchorElements = fixture.debugElement.queryAll(By.css('a'));

      expect(anchorElements.length).toBe(1);

      const firstHref = anchorElements[0].nativeElement.getAttribute('href');

      expect(firstHref).toBe('https://wiki.gematik.de/dosearchsite.action?where=DSKB&queryString=Validierungsfehler%20Metadaten-Upload%20IGS');
    });
  });

  describe('Dialog with empty Clipboard and redirect to homepage', () => {
    const errorMessages: ErrorMessage[] = [{ text: 'First error' }, { text: 'Second error' }];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, ErrorDialogWithSearchInKbComponent],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              errorTitle: 'OtherTitle',
              errors: errorMessages,
              redirectToHome: true,
            },
          },
          Clipboard,
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ErrorDialogWithSearchInKbComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      clipboard = TestBed.inject(Clipboard);
      router = TestBed.inject(Router);
      spyOn(clipboard, 'copy').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should redirect to homepage when clicking the close button', async () => {
      const navigateSpy = spyOn(router, 'navigate');
      await component.onClose();
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('check label of close button', () => {
      const closeButtonLabel = component.closeButtonLabel;
      expect(closeButtonLabel).toBe('Zurück zur Hauptseite');
    });
  });

  describe('Dialog with empty Clipboard and no redirect to homepage', () => {
    const errorMessages: ErrorMessage[] = [{ text: 'First error' }, { text: 'Second error' }];

    beforeEach(() =>
      MockBuilder([ErrorDialogWithSearchInKbComponent, MatDialogModule])
        .provide(MockProvider(MatDialogRef))
        .provide({
          provide: MAT_DIALOG_DATA,
          useValue: {
            errorTitle: 'OtherTitle',
            errors: errorMessages,
            redirectToHome: false,
          },
        })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ErrorDialogWithSearchInKbComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      clipboard = TestBed.inject(Clipboard);
      router = TestBed.inject(Router);
      spyOn(clipboard, 'copy').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeSpy = spyOn(TestBed.inject(MatDialogRef<ErrorDialogWithSearchInKbComponent>), 'close');
      await component.onClose();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
