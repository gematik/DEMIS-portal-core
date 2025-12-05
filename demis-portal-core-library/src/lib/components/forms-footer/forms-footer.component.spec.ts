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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsFooterComponent } from './forms-footer.component';

describe('FormsFooterComponent', () => {
  let component: FormsFooterComponent;
  let fixture: ComponentFixture<FormsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the footer', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('shows all links in correct order', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a.footer-link'));
    const labels = links.map(l => l.textContent?.trim());
    expect(labels).toEqual(['Barrierefreiheit', 'Impressum', 'Datenschutz']);
  });

  it('contains a semantic structure', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toContain('Rechtliche');
  });
});
