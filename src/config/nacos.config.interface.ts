import { ClientOptions as ClientOptionsNative } from 'nacos';
import { FactoryProvider, Logger, LoggerService } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type ClientOptions = ClientOptionsNative & {
  leaderPort?: number;
};

export interface ConfigOptions {
  dataId: string;
  groupName: string;
  options?: {
    unit?: string;
  };
}

export interface ConfigClientOptions {
  configClient: ClientOptions;
  configs: ConfigOptions[];
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
