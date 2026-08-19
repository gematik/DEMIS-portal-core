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

import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

/**
 * Convenience interface for simple use cases without existing domain objects.
 * When using domain-specific objects (e.g. DemisCoding), configure `optionValueKey`,
 * `optionLabelKey`, and `optionDescriptionKey` on the field props instead.
 */
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface FilterableSelectCustomProps extends FormlyFieldProps {
  options: any[];
  optionValueKey?: string;
  optionLabelKey?: string;
  optionDescriptionKey?: string;
  multiple?: boolean;
  showValue?: boolean;
  clearable?: boolean;
  searchPlaceholder?: string;
  noEntriesFoundLabel?: string;
}

function getOptionValue(option: any, valueKey: string): string {
  return option?.[valueKey] ?? '';
}

function getOptionLabel(option: any, labelKey: string): string {
  return option?.[labelKey] ?? '';
}

export function getOptionDescription(option: any, descriptionKey: string): string | undefined {
  return option?.[descriptionKey];
}

export function compareOptions(a: any, b: any, valueKey: string): boolean {
  return a?.[valueKey] === b?.[valueKey];
}

export function filterOptions(options: any[], searchTerm: string, showValue: boolean, labelKey: string, valueKey: string): any[] {
  if (!searchTerm) {
    return options;
  }
  const lower = searchTerm.toLowerCase();
  return options.filter(
    option => getOptionLabel(option, labelKey).toLowerCase().includes(lower) || (showValue && getOptionValue(option, valueKey).toLowerCase().includes(lower))
  );
}

export function formatOptionDisplay(option: any, showValue: boolean, labelKey: string, valueKey: string): string {
  if (!option) {
    return '';
  }
  const label = getOptionLabel(option, labelKey);
  return showValue ? `${label} | ${getOptionValue(option, valueKey)}` : label;
}

function isExplicitDefaultValueInOptions<T>(defaultValue: T | T[], options: T[], valueKey: string): boolean {
  const defaultValues = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  return defaultValues.every(defaultOption => options.some(option => compareOptions(option, defaultOption, valueKey)));
}

function resolveDefaultValue<T>(
  options: T[],
  multiple: boolean | undefined,
  hasExplicitDefaultValue: boolean,
  defaultValue: T | T[] | undefined
): T | T[] | undefined {
  if (hasExplicitDefaultValue) {
    return defaultValue;
  }

  if (options.length !== 1) {
    return undefined;
  }

  return multiple ? [options[0]] : options[0];
}

// ---------------------------------------------------------------------------
// Type-safe field config builder
// ---------------------------------------------------------------------------

interface FilterableSelectBaseFieldConfig<TOption> {
  id?: string;
  key: string;
  label: string;
  defaultValue?: TOption | TOption[];
  required?: boolean;
  multiple?: boolean;
  showValue?: boolean;
  clearable?: boolean;
  searchPlaceholder?: string;
  noEntriesFoundLabel?: string;
  [extraProp: string]: any;
}

type FilterableSelectFieldConfig<T> = T extends SelectOption
  ? FilterableSelectBaseFieldConfig<T> & { options: T[] }
  : FilterableSelectBaseFieldConfig<T> & {
      options: T[];
      optionValueKey: keyof T & string;
      optionLabelKey: keyof T & string;
      optionDescriptionKey?: keyof T & string;
    };

export function filterableSelectField<T>(config: FilterableSelectFieldConfig<T>): FormlyFieldConfig {
  const { id, key, label, defaultValue, options, required, multiple, showValue, clearable, searchPlaceholder, noEntriesFoundLabel, ...extra } = config;
  const hasExplicitDefaultValue = Object.hasOwn(config, 'defaultValue');
  const optionValueKey = 'optionValueKey' in config ? config.optionValueKey : 'value';

  if (hasExplicitDefaultValue && defaultValue !== undefined && !isExplicitDefaultValueInOptions(defaultValue, options, optionValueKey)) {
    throw new Error('filterableSelectField defaultValue must match one of the provided options.');
  }

  const props: Record<string, any> = { label, options, ...extra };
  if (required != null) props['required'] = required;
  if (multiple != null) props['multiple'] = multiple;
  if (showValue != null) props['showValue'] = showValue;
  if (clearable != null) props['clearable'] = clearable;
  if (searchPlaceholder != null) props['searchPlaceholder'] = searchPlaceholder;
  if (noEntriesFoundLabel != null) props['noEntriesFoundLabel'] = noEntriesFoundLabel;

  const resolvedDefaultValue = resolveDefaultValue(options, multiple, hasExplicitDefaultValue, defaultValue);

  return {
    ...(id ? { id } : {}),
    ...(hasExplicitDefaultValue || resolvedDefaultValue !== undefined ? { defaultValue: resolvedDefaultValue } : {}),
    key,
    type: 'filterable-select',
    props,
  };
}
