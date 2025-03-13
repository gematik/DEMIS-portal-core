/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { SectionTitleComponent } from './section-title.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

describe('SectionTitleComponent', () => {
  let component: SectionTitleComponent;
  let fixture: MockedComponentFixture<SectionTitleComponent, SectionTitleComponent>;

  beforeEach(() => MockBuilder(SectionTitleComponent));

  beforeEach(() => {
    fixture = MockRender(SectionTitleComponent);
    component = fixture.point.componentInstance;
    fixture.componentInstance.titleText = 'Test Title';
    fixture.componentInstance.level = 1;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title text', () => {
    const titleText = 'Test Title';
    component.titleText = titleText;
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h2 span');
    expect(titleElement.textContent).toContain(titleText);
  });

  it('should have default level 1', () => {
    expect(component.level).toBe(1);
  });

  it('should apply level 1 styles', () => {
    component.level = 1;
    fixture.detectChanges();
    const sectionElement = fixture.nativeElement.querySelector('.gem-demis-section');
    expect(sectionElement.classList).toContain('gem-demis-section-level-1');
  });

  it('should apply level 2 styles', () => {
    component.level = 2;
    fixture.detectChanges();
    const sectionElement = fixture.nativeElement.querySelector('.gem-demis-section');
    expect(sectionElement.classList).toContain('gem-demis-section-level-2');
  });
});
