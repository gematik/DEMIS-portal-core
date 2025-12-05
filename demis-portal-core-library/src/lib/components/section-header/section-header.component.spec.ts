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

import { MockBuilder, MockRender } from 'ng-mocks';
import { SECTION_TITLE_DEFAULT_LEVEL, SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  beforeEach(
    () => MockBuilder().keep(SectionHeaderComponent) // real rendern
  );

  it('should create the component', () => {
    const fixture = MockRender(SectionHeaderComponent, { titleText: 'Test Title' });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the title text', () => {
    const titleText = 'Test Title';
    const fixture = MockRender(SectionHeaderComponent, { titleText });
    fixture.detectChanges();

    const native: HTMLElement = fixture.point.nativeElement as HTMLElement;
    // robust: finde entweder h2 oder h1
    const titleSpan = native.querySelector('h2.section-header .section-header-title') ?? native.querySelector('h1.section-header .section-header-title');

    expect(titleSpan).withContext('title span should exist').toBeTruthy();
    expect(titleSpan?.textContent?.trim()).toContain(titleText);
  });

  it('should have default level 2', () => {
    const fixture = MockRender(SectionHeaderComponent, {
      titleText: 'Test Title',
    });
    const component = fixture.point.componentInstance;
    expect(component.level()).toBe(SECTION_TITLE_DEFAULT_LEVEL);
  });

  it('should apply level 1 styles', () => {
    const fixture = MockRender(SectionHeaderComponent, {
      titleText: 'Test Title',
      level: SECTION_TITLE_DEFAULT_LEVEL,
    });
    fixture.detectChanges();

    const sectionElement: HTMLElement = fixture.point.nativeElement.querySelector('.gem-demis-section-header');
    expect(sectionElement).toBeTruthy();
    expect(sectionElement.classList).toContain(`gem-demis-section-header-level-${SECTION_TITLE_DEFAULT_LEVEL}`);
  });

  it('should apply level 2 styles', () => {
    const fixture = MockRender(SectionHeaderComponent, {
      titleText: 'Test Title',
      level: 2,
    });
    fixture.detectChanges();

    const sectionElement: HTMLElement = fixture.point.nativeElement.querySelector('.gem-demis-section-header');
    expect(sectionElement.classList).toContain('gem-demis-section-header-level-2');
  });

  it('should render h1 when headingTag is set to h1', () => {
    const fixture = MockRender(SectionHeaderComponent, {
      titleText: 'Test Title',
      level: 1,
    });
    fixture.detectChanges();

    const native: HTMLElement = fixture.point.nativeElement as HTMLElement;
    const h1Span = native.querySelector('h1.section-header .section-header-title');
    const h2 = native.querySelector('h2.section-header');

    expect(h1Span?.textContent?.trim()).toContain('Test Title');
    expect(h2).toBeFalsy();
  });
});
