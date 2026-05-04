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

import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

/**
 * Defines the logger configuration used by `ngx-logger`.
 */
export interface NgxLoggerConfig {
  level: number;
  disableConsoleLogging: boolean;
  serverLogLevel: number;
}

/**
 * Default logger configuration for development environments.
 * Enables verbose logging and keeps console logging active.
 */
export const LOGGER_CONFIG_FOR_DEV: NgxLoggerConfig = {
  level: NgxLoggerLevel.DEBUG,
  disableConsoleLogging: false,
  serverLogLevel: NgxLoggerLevel.DEBUG,
};

/**
 * Default logger configuration for production environments.
 * Restricts logging to errors and disables server logging.
 */
export const LOGGER_CONFIG_FOR_PROD: NgxLoggerConfig = {
  level: NgxLoggerLevel.ERROR,
  disableConsoleLogging: true,
  serverLogLevel: NgxLoggerLevel.OFF,
};

/**
 * Applies the provided logger configuration to the given logger instance.
 *
 * @param logger - The `NGXLogger` instance to update.
 * @param ngxLoggerConfig - The target configuration values.
 * @returns The updated `NGXLogger` instance.
 */
export function updateConfigurationForLogger(logger: NGXLogger, ngxLoggerConfig: NgxLoggerConfig) {
  const currentConfig = logger.getConfigSnapshot();
  currentConfig.level = ngxLoggerConfig.level;
  currentConfig.disableConsoleLogging = ngxLoggerConfig.disableConsoleLogging;
  currentConfig.serverLogLevel = ngxLoggerConfig.serverLogLevel;
  logger.updateConfig(currentConfig);
  return logger;
}
