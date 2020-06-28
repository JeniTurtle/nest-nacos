import { FactoryProvider, Logger, LoggerService } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { NacosSubscribeOptions } from '../instance';

export interface NacosNamingModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<NacosNamingConfig> | NacosNamingConfig;
  inject?: FactoryProvider['inject'];
}

export interface NacosClientOptions {
  serverList?: string | string[];
  namespace?: string;
  ssl?: boolean;
  ak?: string;
  sk?: string;
  appName?: string;
  endpoint?: string;
  vipSrvRefInterMillis?: number;
}

export interface NacosNamingConfig {
  naming: NacosNamingOptions;
  subscribers: NacosSubscribeOptions[];
}

export interface NacosNamingOptions extends NacosClientOptions {
  loggerLevel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  logger?: Logger | LoggerService;
}
