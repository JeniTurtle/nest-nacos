import { ClientOptions as ClientOptionsNative } from 'nacos';
import { FactoryProvider, Logger, LoggerService } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type ClientOptions = ClientOptionsNative & {
  leaderPort?: number;
};

export interface ConfigOptionsList {
  [key: string]: ConfigOptions;
}

export interface ConfigOptions {
  dataId: string;
  groupName: string;
  options?: {
    unit?: string;
  };
}

export interface ConfigClientOptions {
  client: ClientOptions;
  configs: ConfigOptionsList;
  logger?: Logger | LoggerService;
  loggerLevel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

export interface NacosConfigModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<ConfigClientOptions> | ConfigClientOptions;
  inject?: FactoryProvider['inject'];
}
