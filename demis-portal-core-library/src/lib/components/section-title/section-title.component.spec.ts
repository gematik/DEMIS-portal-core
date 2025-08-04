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

import { SectionTitleComponent, SECTION_TITLE_DEFAULTS } from './section-title.component';
import { MockBuilder, MockRender } from 'ng-mocks';

describe('SectionTitleComponent', () => {
  beforeEach(() => MockBuilder(SectionTitleComponent));

  it('should create the component', () => {
    const fixture = MockRender(SectionTitleComponent, { titleText: 'Test Title' });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the title text', () => {
    const titleText = 'Test Title';
    const fixture = MockRender(SectionTitleComponent, { titleText: titleText });
    fixture.detectChanges();
    const titleElement = fixture.point.nativeElement.querySelector('h2 span');
    expect(titleElement.textContent).toContain(titleText);
  });

  it('should have default level 1', () => {
    // Verwendung der exportierten Standardwerte
    const fixture = MockRender(SectionTitleComponent, {
      titleText: 'Test Title',
      level: SECTION_TITLE_DEFAULTS.level,
    });
    const component = fixture.point.componentInstance;
    expect(component.level()).toBe(SECTION_TITLE_DEFAULTS.level);
  });

  it('should apply level 1 styles', () => {
    const fixture = MockRender(SectionTitleComponent, {
      titleText: 'Test Title',
      level: SECTION_TITLE_DEFAULTS.level,
    });
    fixture.detectChanges();
    const sectionElement = fixture.point.nativeElement.querySelector('.gem-demis-section');
    expect(sectionElement.classList).toContain(`gem-demis-section-level-${SECTION_TITLE_DEFAULTS.level}`);
  });

  it('should apply level 2 styles', () => {
    const fixture = MockRender(SectionTitleComponent, { titleText: 'Test Title', level: 2 });
    fixture.detectChanges();
    const sectionElement = fixture.point.nativeElement.querySelector('.gem-demis-section');
    expect(sectionElement.classList).toContain('gem-demis-section-level-2');
  });
});
