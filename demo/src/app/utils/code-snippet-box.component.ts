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

import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';

export interface CodeSnippet {
  fileName: string;
  language: string;
  codeSnippetPath: string;
}

export interface CodeExampleBoxComponentOptions {
  expanderTitle: string;
  expanderDescription: string;
  codeSnippets: CodeSnippet[];
}

@Component({
  selector: 'app-code-snippet-box',
  standalone: true,
  imports: [Highlight, HighlightLineNumbers, MatTabsModule],
  template: ` <pre><code [highlight]="codeSnippetString" [language]="language" lineNumbers></code></pre> `,
})
export class CodeSnippetBoxComponent implements OnInit {
  @Input() codeSnippetPath: string = '';
  @Input({ required: true }) language!: string;
  @Input() codeSnippetString: string = '';
  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    if (!this.codeSnippetString) {
      this.http.get(`${this.codeSnippetPath}`, { responseType: 'text' }).subscribe(data => {
        this.codeSnippetString = data;
      });
    }
  }
}
