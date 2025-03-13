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



/**
 * Clones an object or an array given as parameter. If the parameter is not an object or an array, it simply returns the given value.
 *
 * @param arg The object or array to clone
 * @returns A clone of the object or array
 */
export function cloneObject<T>(arg: T): T {
  if (typeof arg !== 'object' || arg === null) {
    return arg;
  }

  const res: any = Array.isArray(arg) ? [] : {};
  for (const key in arg) {
    if (arg.hasOwnProperty(key)) {
      res[key] = cloneObject(arg[key]);
    }
  }
  return res as T;
}
