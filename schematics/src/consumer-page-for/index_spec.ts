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

import { describe, it, expect } from 'vitest';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'node:path';

const collectionPath = path.join(__dirname, '../collection.json');

const ANGULAR_JSON = JSON.stringify({
  version: 1,
  projects: {
    demo: {
      projectType: 'application',
      schematics: { '@schematics/angular:component': { style: 'scss' } },
      root: 'demo',
      sourceRoot: 'demo/src',
      prefix: 'app',
      architect: {
        build: { builder: '@angular/build:application', options: { tsConfig: 'demo/tsconfig.app.json' } },
      },
    },
  },
});

const APP_ROUTES_STUB = `import { Routes } from '@angular/router';

export const componentConsumerRoutes: Routes = [];
`;

function createTestTree(): UnitTestTree {
  const tree = new UnitTestTree(Tree.empty());
  tree.create('angular.json', ANGULAR_JSON);
  tree.create('demo/src/app/app.routes.ts', APP_ROUTES_STUB);
  return tree;
}

describe('consumer-page-for', () => {
  it('generates files for a given name', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('consumer-page-for', { name: 'test' }, createTestTree());

    expect(tree.files.length).toBeGreaterThan(0);
  });
});
