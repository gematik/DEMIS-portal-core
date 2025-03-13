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



import { SecondaryButtonDirective } from './secondary-button.directive';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MockBuilder, MockRender } from 'ng-mocks';

@Component({
  template: ` <button mat-stroked-button color="secondary" appSecondaryButton></button> `,
})
class TestComponent {}

describe('SecondaryButtonDirective', () => {
  beforeEach(() => MockBuilder(TestComponent).keep(SecondaryButtonDirective).mock(MatButtonModule));

  it('should apply border color', () => {
    const fixture = MockRender(TestComponent);
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.style.borderColor).toBe('var(--gem-demis-primary-color)');
  });

  it('should apply text color', () => {
    const fixture = MockRender(TestComponent);
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.style.color).toBe('var(--gem-demis-primary-color)');
  });

  it('should apply background color', () => {
    const fixture = MockRender(TestComponent);
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
