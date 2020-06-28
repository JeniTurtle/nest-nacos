import { Provider } from '@nestjs/common';
import {
  ConfigClientOptions,
  NacosConfigModuleAsyncOptions,
} from './nacos.config.interface';
import { NACOS_CONFIG_OPTION } from './nacos.config.constants';

export function createConfigOptionsProvider(
  nacosConfigOptions: ConfigClientOptions,
): Provider<ConfigClientOptions> {
  return {
    provide: NACOS_CONFIG_OPTION,
    useValue: nacosConfigOptions,
  };
}

export function createAsyncConfigOptionsProvider(
  nacosConfigOptions: NacosConfigModuleAsyncOptions,
): Provider {
  return {
    provide: NACOS_CONFIG_OPTION,
    useFactory: nacosConfigOptions.useFactory,
    inject: [...(nacosConfigOptions.inject || [])],
  };
}
