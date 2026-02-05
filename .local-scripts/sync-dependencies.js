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

const fs = require('fs');
const path = require('path');
const rootPkg = require('../package.json');
const libPkgPath = path.resolve(__dirname, '../demis-portal-core-library/package.json');
const libPkg = require(libPkgPath);

const peerDepsToSync = [
  '@angular/animations',
  '@angular/cdk',
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/material-date-fns-adapter',
  '@angular/material',
  '@angular/platform-browser-dynamic',
  '@angular/platform-browser',
  '@angular/router',
  '@ngx-formly/core',
  '@ngx-formly/material',
  'ngx-logger',
  'rxjs',
  'zone.js',
];

const depsToSync = ['tslib'];

console.log('Syncing dependencies...');

console.log('\nThe following peer dependencies will be synced:');
peerDepsToSync.forEach(dep => {
  console.log(`- ${dep}`);
});

console.log('\nThe following dependencies will be synced:');
depsToSync.forEach(dep => {
  console.log(`- ${dep}`);
});

libPkg.peerDependencies = libPkg.peerDependencies || {};
libPkg.dependencies = libPkg.dependencies || {};

peerDepsToSync.forEach(dep => {
  if (rootPkg.dependencies[dep]) {
    libPkg.peerDependencies[dep] = rootPkg.dependencies[dep];
  }
});

depsToSync.forEach(dep => {
  if (rootPkg.dependencies[dep]) {
    libPkg.dependencies[dep] = rootPkg.dependencies[dep];
  }
});

fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2));
console.log('\nDependencies are in sync now!');
