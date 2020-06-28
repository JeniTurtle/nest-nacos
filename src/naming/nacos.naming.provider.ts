import { Provider } from '@nestjs/common';
import {
  NacosNamingConfig,
  NacosNamingModuleAsyncOptions,
} from './nacos.naming.interface';
import { NACOS_NAMING_OPTION } from './nacos.naming.constants';

export function createOptionsProvider(
  nacosNamingConfig: NacosNamingConfig,
): Provider<NacosNamingConfig> {
  return {
    provide: NACOS_NAMING_OPTION,
    useValue: nacosNamingConfig,
  };
}

export function createAsyncOptionsProvider(
  options: NacosNamingModuleAsyncOptions,
): Provider {
  return {
    provide: NACOS_NAMING_OPTION,
    useFactory: options.useFactory,
    inject: options.inject || [],
  };
}
