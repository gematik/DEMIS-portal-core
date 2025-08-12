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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDialogComponent } from './submit-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('SubmitDialogComponent', () => {
  let component: SubmitDialogComponent;
  let fixture: ComponentFixture<SubmitDialogComponent>;
  let router: Router;
  let dialogRef: MatDialogRef<SubmitDialogComponent>;

  const notificationId = '123-456-789';
  const timestamp = '12.12.2024 12:00:00';
  const fileName = 'test-file.pdf';
  const authorEmail = 'rki@gematik.demis';
  const href = 'blob:test-url';

  beforeEach(async () => {
    const dialogRefMock = {
      close: jasmine.createSpy('close'),
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [SubmitDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: Router, useValue: routerMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            notificationId: notificationId,
            timestamp: timestamp,
            fileName: fileName,
            authorEmail: authorEmail,
            href: href,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitDialogComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialogRef = TestBed.inject(MatDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should show the correct notificationId', () => {
    const idElement = fixture.debugElement.query(By.css('#success-id')).nativeElement;
    expect(idElement.textContent).toContain(notificationId);
  });

  it('should show the correct timestamp', () => {
    const timestampElement = fixture.debugElement.query(By.css('#success-timestamp')).nativeElement;
    expect(timestampElement.textContent).toContain(timestamp);
  });

  it('should show the correct fileName', () => {
    const linkElement = fixture.debugElement.query(By.css('#success-result a')).nativeElement;
    expect(linkElement.getAttribute('download')).toBe(fileName);
  });

  it('should show the correct authorEmail', () => {
    const emailElement = fixture.debugElement.query(By.css('#success-info a')).nativeElement;
    expect(emailElement.textContent).toBe(authorEmail);
    expect(emailElement.getAttribute('href')).toBe(`mailto:${authorEmail}`);
  });

  xit('should trigger download on initialization', () => {
    //TODO implement
    expect(true).toBe(true);
  });

  it('should navigate to home on button click', () => {
    const homeButton = fixture.debugElement.query(By.css('#btn-back-to-homepage')).nativeElement;
    homeButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
