import { Module, DynamicModule, Global } from '@nestjs/common';
import {
  ConfigClientOptions,
  NacosConfigModuleAsyncOptions,
} from './nacos.config.interface';
import {
  createConfigOptionsProvider,
  createAsyncConfigOptionsProvider,
} from './nacos.config.provider';
import { createNacosConfigService } from './nacos.config.service';
import { NacosConfigLifecycle } from './nacos.config.lifecycle';

@Global()
@Module({})
export class NacosConfigModule {
  static forRoot(options: ConfigClientOptions): DynamicModule {
    const optionsProvider = createConfigOptionsProvider(options);
    const configService = createNacosConfigService();
    return {
      module: NacosConfigModule,
      imports: [],
      providers: [NacosConfigLifecycle, optionsProvider, configService],
      exports: [configService],
    };
  }

  static forRootAsync(options: NacosConfigModuleAsyncOptions): DynamicModule {
    const optionsProvider = createAsyncConfigOptionsProvider(options);
    const configService = createNacosConfigService();
    return {
      module: NacosConfigModule,
      imports: [],
      providers: [NacosConfigLifecycle, optionsProvider, configService],
      exports: [configService],
    };
  }
}
