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

import { LOGGER_CONFIG_FOR_DEV, LOGGER_CONFIG_FOR_PROD, updateConfigurationForLogger } from './configure-logger.function';

describe('LOGGER_CONFIG_FOR_DEV', () => {
  it('should expose debug defaults for development', () => {
    expect(LOGGER_CONFIG_FOR_DEV.level).toBe(NgxLoggerLevel.DEBUG);
    expect(LOGGER_CONFIG_FOR_DEV.disableConsoleLogging).toBeFalse();
    expect(LOGGER_CONFIG_FOR_DEV.serverLogLevel).toBe(NgxLoggerLevel.DEBUG);
  });
});

describe('LOGGER_CONFIG_FOR_PROD', () => {
  it('should expose restrictive defaults for production', () => {
    expect(LOGGER_CONFIG_FOR_PROD.level).toBe(NgxLoggerLevel.ERROR);
    expect(LOGGER_CONFIG_FOR_PROD.disableConsoleLogging).toBeTrue();
    expect(LOGGER_CONFIG_FOR_PROD.serverLogLevel).toBe(NgxLoggerLevel.OFF);
  });
});

describe('updateConfigurationForLogger', () => {
  it('should call snapshot and update exactly once with the same object reference', () => {
    const currentConfig = {
      level: NgxLoggerLevel.INFO,
      disableConsoleLogging: false,
      serverLogLevel: NgxLoggerLevel.WARN,
      customProperty: 'kept',
    };

    const loggerSpy = jasmine.createSpyObj<NGXLogger>('NGXLogger', ['getConfigSnapshot', 'updateConfig']);
    loggerSpy.getConfigSnapshot.and.returnValue(currentConfig as any);

    const newConfig = {
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: true,
      serverLogLevel: NgxLoggerLevel.ERROR,
    };

    updateConfigurationForLogger(loggerSpy, newConfig);

    expect(loggerSpy.getConfigSnapshot).toHaveBeenCalledTimes(1);
    expect(loggerSpy.updateConfig).toHaveBeenCalledTimes(1);
    expect(loggerSpy.updateConfig).toHaveBeenCalledWith(currentConfig as any);
    expect(loggerSpy.updateConfig.calls.mostRecent().args[0] as object).toBe(currentConfig);
  });

  it('should overwrite logger config values and keep unrelated properties', () => {
    const currentConfig = {
      level: NgxLoggerLevel.INFO,
      disableConsoleLogging: false,
      serverLogLevel: NgxLoggerLevel.WARN,
      customProperty: 'kept',
    };

    const loggerSpy = jasmine.createSpyObj<NGXLogger>('NGXLogger', ['getConfigSnapshot', 'updateConfig']);
    loggerSpy.getConfigSnapshot.and.returnValue(currentConfig as any);

    const newConfig = {
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: true,
      serverLogLevel: NgxLoggerLevel.ERROR,
    };

    updateConfigurationForLogger(loggerSpy, newConfig);

    expect(currentConfig.level).toBe(NgxLoggerLevel.DEBUG);
    expect(currentConfig.disableConsoleLogging).toBeTrue();
    expect(currentConfig.serverLogLevel).toBe(NgxLoggerLevel.ERROR);
    expect(currentConfig.customProperty).toBe('kept');
  });

  it('should return the same logger instance', () => {
    const loggerSpy = jasmine.createSpyObj<NGXLogger>('NGXLogger', ['getConfigSnapshot', 'updateConfig']);
    loggerSpy.getConfigSnapshot.and.returnValue({
      level: NgxLoggerLevel.INFO,
      disableConsoleLogging: false,
      serverLogLevel: NgxLoggerLevel.WARN,
    } as any);

    const result = updateConfigurationForLogger(loggerSpy, {
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: true,
      serverLogLevel: NgxLoggerLevel.ERROR,
    });

    expect(result).toBe(loggerSpy);
  });
});
