import { FactoryProvider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface NacosInstanceConfig {
  instance: NacosInstanceOptions;
  subscribers: NacosSubscribeOptions[];
}

export interface NacosInstanceModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<NacosInstanceConfig> | NacosInstanceConfig;
  inject?: FactoryProvider['inject'];
}

export interface NacosInstance {
  instanceId: string;
  clusterName: string;
  serviceName: string;
  ip: string;
  port: number;
  weight: number;
  ephemeral: boolean;
  enabled: boolean;
  valid: boolean;
  marked: boolean;
  healthy: boolean;
  metadata: any;
}

export interface NacosInstanceOptions {
  serviceName: string;
  clusterName?: string;
  groupName?: string;
  ip: string;
  port: number;
  weight?: number;
  valid?: boolean;
  healthy?: boolean;
  enabled?: boolean;
  ephemeral?: boolean;
  metadata?: any;
}

export interface NacosSubscribeOptions {
  serviceName: string;
  groupName?: string;
  clusters?: string;
}
