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



import { cloneObject } from './clone-object.function';

/**
 * Clones a given parameter value and Applies a callback to the clone. Applies the callback recursivly, if the parameter value is an object or an array.
 *
 * @param arg The value to clone and apply the callback to
 * @param callback The callback to apply to each value
 */
export function applyRecursivly(arg: any, callback: (value: any) => any) {
  if (typeof arg === 'object' && arg !== null) {
    const objectClone: any = cloneObject(arg);
    for (const key in objectClone) {
      objectClone[key] = applyRecursivly(objectClone[key], callback);
    }
    return objectClone;
  } else {
    return callback(arg);
  }
}
