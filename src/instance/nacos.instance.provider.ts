import { Provider } from '@nestjs/common';
import {
  NacosInstanceConfig,
  NacosInstanceModuleAsyncOptions,
} from './nacos.instance.interface';
import { NACOS_INSTANCE_OPTION } from './nacos.instance.constants';

export function createInstanceOptionsProvider(
  nacosInstanceConfig: NacosInstanceConfig,
): Provider<NacosInstanceConfig> {
  return {
    provide: NACOS_INSTANCE_OPTION,
    useValue: nacosInstanceConfig,
  };
}

export function createInstanceAsyncOptionsProvider(
  options: NacosInstanceModuleAsyncOptions,
): Provider {
  return {
    provide: NACOS_INSTANCE_OPTION,
    useFactory: options.useFactory,
    inject: options.inject || [],
  };
}
